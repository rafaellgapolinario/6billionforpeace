import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  turnstileToken: z.string().optional(),
});

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

  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const ip = (fwd.split(',')[0] || '').trim() || null;

  // Extra layer of brute-force defense beyond Supabase native limit.
  const rl = checkRateLimit(`admin:login:${ip ?? 'noip'}`, 5, 15 * 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }

  const turnstileOk = await verifyTurnstile(parsed.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: 'captcha' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password,
  });
  if (error) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
