import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { countryCodes } from '@/lib/countries';
import { locales } from '@/i18n/locales';
import { sendConfirmationEmail } from '@/lib/email';

export const runtime = 'nodejs';

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(254),
  country: z.string().length(2),
  locale: z.string().length(2),
  supportsTreaty: z.literal(true),
  consent: z.literal(true),
  turnstileToken: z.string().optional(),
});

function sanitizeName(raw: string): string {
  return raw
    .replace(/[\d.\-/]{6,}/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const COUNTRY_SET = new Set(countryCodes);
const LOCALE_SET = new Set<string>(locales as readonly string[]);
const RATE_LIMIT_WINDOW_MIN = 5;
const RATE_LIMIT_MAX = 3;

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (ip) form.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const j = (await r.json()) as { success?: boolean };
  return Boolean(j.success);
}

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const country = parsed.country.toUpperCase();
  if (!COUNTRY_SET.has(country)) {
    return NextResponse.json({ error: 'invalid_country' }, { status: 400 });
  }
  const locale = parsed.locale.toLowerCase();
  if (!LOCALE_SET.has(locale)) {
    return NextResponse.json({ error: 'invalid_locale' }, { status: 400 });
  }

  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const ip = (fwd.split(',')[0] || '').trim() || null;
  const userAgent = req.headers.get('user-agent') ?? '';
  const ipCountry =
    req.headers.get('x-vercel-ip-country') ??
    req.headers.get('cf-ipcountry') ??
    null;

  const ok = await verifyTurnstile(parsed.turnstileToken, ip);
  if (!ok) {
    return NextResponse.json({ error: 'captcha' }, { status: 403 });
  }

  const salt = process.env.IP_HASH_SALT ?? 'dev_salt_change_me';
  const ipHash = ip
    ? crypto.createHash('sha256').update(`${ip}|${salt}`).digest('hex')
    : null;

  const cleanedName = sanitizeName(parsed.name);
  if (cleanedName.length < 2) {
    return NextResponse.json({ error: 'invalid_name' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // ---- rate limit per ip_hash (sliding window) ----
  if (ipHash) {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
    const { count, error: rlErr } = await supabase
      .from('signatures')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since);
    if (!rlErr && (count ?? 0) >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
    }
  }

  // ---- double opt-in token ----
  const requireConfirm = process.env.RESEND_API_KEY ? true : false;
  const confirmationToken = requireConfirm ? crypto.randomBytes(32).toString('hex') : null;
  const confirmedAt = requireConfirm ? null : new Date().toISOString();

  const { data: inserted, error } = await supabase
    .from('signatures')
    .insert({
      name: cleanedName,
      email: parsed.email.toLowerCase(),
      country,
      locale,
      ip_country: ipCountry?.toUpperCase() ?? null,
      ip_hash: ipHash,
      user_agent: userAgent.slice(0, 512),
      supports_treaty: true,
      confirmation_token: confirmationToken,
      confirmed_at: confirmedAt,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 });
    }
    console.error('[sign] insert error', error);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  if (requireConfirm && confirmationToken) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      `https://${req.headers.get('host') ?? '6billionforpeace.vercel.app'}`;
    const confirmUrl = `${baseUrl}/api/confirm?token=${confirmationToken}`;
    try {
      const sent = await sendConfirmationEmail({
        to: parsed.email.toLowerCase(),
        name: cleanedName,
        locale,
        confirmUrl,
      });
      if (!sent) {
        // email skipped (no key in env at request time) → auto-confirm so user never gets stuck
        await supabase
          .from('signatures')
          .update({ confirmed_at: new Date().toISOString(), confirmation_token: null })
          .eq('id', inserted!.id);
        return NextResponse.json({ ok: true, pending: false });
      }
    } catch (e) {
      console.error('[sign] email failed', e);
      // do not block sign — user already in DB awaiting confirmation
    }
  }

  return NextResponse.json({ ok: true, pending: requireConfirm });
}
