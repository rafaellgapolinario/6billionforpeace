import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { countryCodes } from '@/lib/countries';
import { locales } from '@/i18n/locales';

export const runtime = 'nodejs';

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(254),
  country: z.string().length(2),
  city: z.string().trim().max(120).optional().or(z.literal('')),
  locale: z.string().length(2),
  consent: z.literal(true),
  turnstileToken: z.string().optional(),
});

const COUNTRY_SET = new Set(countryCodes);
const LOCALE_SET = new Set<string>(locales as readonly string[]);

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured yet (D1)
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
  } catch (err) {
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

  // ---- collect request signals (server-only, never returned) ----
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

  // ---- LGPD/GDPR-friendly: store sha256(ip + salt), not the raw IP ----
  const salt = process.env.IP_HASH_SALT ?? 'dev_salt_change_me';
  const ipHash = ip
    ? crypto.createHash('sha256').update(`${ip}|${salt}`).digest('hex')
    : null;

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('signatures').insert({
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    country,
    city: parsed.city || null,
    locale,
    ip_country: ipCountry?.toUpperCase() ?? null,
    ip_hash: ipHash,
    user_agent: userAgent.slice(0, 512),
  });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 });
    }
    console.error('[sign] insert error', error);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
