import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { countryCodes } from '@/lib/countries';
import { locales } from '@/i18n/locales';
import { sendThankYouEmail } from '@/lib/email';
import { isDisposableEmail } from '@/lib/disposable';

export const runtime = 'nodejs';

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(254),
  country: z.string().length(2),
  locale: z.string().length(2),
  supportsTreaty: z.literal(true),
  consent: z.literal(true),
  turnstileToken: z.string().optional(),
  // Anti-bot signals
  website: z.string().optional(), // honeypot — must stay empty
  formStartedAt: z.number().int().optional(), // ms timestamp when form mounted
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
const MIN_FORM_FILL_MS = 3000; // bot threshold

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

function isSameOrigin(req: Request): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://6billionforpeace.net';
  const allowed = new Set<string>([
    siteUrl,
    siteUrl.replace('://', '://www.'),
  ]);
  // Permite preview deployments do Vercel + dev local
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV !== 'production') allowed.add('http://localhost:3000');

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  if (origin && [...allowed].some((a) => origin === a)) return true;
  if (referer && [...allowed].some((a) => referer.startsWith(a + '/') || referer === a)) return true;
  return false;
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  // ---- silent honeypot: bot fills, return fake-ok so it does not retry ----
  if (parsed.website && parsed.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // ---- timing: humans take >3s to fill form ----
  if (parsed.formStartedAt) {
    const elapsed = Date.now() - parsed.formStartedAt;
    if (elapsed < MIN_FORM_FILL_MS) {
      return NextResponse.json({ error: 'too_fast' }, { status: 400 });
    }
  }

  const country = parsed.country.toUpperCase();
  if (!COUNTRY_SET.has(country)) {
    return NextResponse.json({ error: 'invalid_country' }, { status: 400 });
  }
  const locale = parsed.locale.toLowerCase();
  if (!LOCALE_SET.has(locale)) {
    return NextResponse.json({ error: 'invalid_locale' }, { status: 400 });
  }

  if (isDisposableEmail(parsed.email)) {
    return NextResponse.json({ error: 'disposable_email' }, { status: 400 });
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

  // ---- rate limit per ip_hash ----
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

  // Auto-confirm: counts immediately. Email goes out as a thank-you (no gating).
  const { error } = await supabase.from('signatures').insert({
    name: cleanedName,
    email: parsed.email.toLowerCase(),
    country,
    locale,
    ip_country: ipCountry?.toUpperCase() ?? null,
    ip_hash: ipHash,
    user_agent: userAgent.slice(0, 512),
    supports_treaty: true,
    confirmed_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 });
    }
    console.error('[sign] insert error', error);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  // Fire-and-forget thank-you email. Failure must not block the response.
  if (process.env.RESEND_API_KEY) {
    sendThankYouEmail({
      to: parsed.email.toLowerCase(),
      name: cleanedName,
      locale,
    }).catch((e) => console.error('[sign] thank-you email failed', e));
  }

  return NextResponse.json({ ok: true });
}
