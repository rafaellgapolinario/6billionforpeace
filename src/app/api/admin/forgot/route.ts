import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  email: z.string().email().toLowerCase(),
});

export async function POST(req: Request) {
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const ip = (fwd.split(',')[0] || '').trim() || 'noip';

  // Limita pra evitar email-bombing.
  const rl = checkRateLimit(`admin:forgot:${ip}`, 3, 60 * 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: true });
  }

  const admin = createSupabaseAdminClient();

  // Só envia reset se o email é de algum admin. Resposta é sempre 200 OK
  // pra não vazar quais emails estão cadastrados.
  const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = users?.users?.find((u) => u.email?.toLowerCase() === parsed.email);
  if (!user) return NextResponse.json({ ok: true });

  const { data: adminRow } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!adminRow) return NextResponse.json({ ok: true });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://6billionforpeace.net';
  await admin.auth.admin.generateLink({
    type: 'recovery',
    email: parsed.email,
    options: { redirectTo: `${siteUrl}/admin/reset` },
  });
  // Supabase envia o email automaticamente quando generateLink type='recovery'
  // é chamado E SMTP está configurado no painel. Sem SMTP, o link fica só no
  // response do generateLink (não enviado). Pra prod, configurar SMTP Resend.

  return NextResponse.json({ ok: true });
}
