import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const { data: rows, error } = await admin
    .from('admin_users')
    .select('user_id, role, created_at')
    .order('created_at', { ascending: true });
  if (error) {
    console.error('[admin/users] list error', error);
    return NextResponse.json({ error: 'query_failed' }, { status: 500 });
  }

  // Resolve emails via auth.users
  const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const emailMap = new Map(usersData?.users?.map((u) => [u.id, u.email ?? '']) ?? []);

  return NextResponse.json({
    rows: rows.map((r) => ({
      user_id: r.user_id,
      email: emailMap.get(r.user_id) ?? '',
      role: r.role,
      created_at: r.created_at,
    })),
  });
}

const CreateBody = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
  role: z.enum(['admin', 'owner']),
});

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  let parsed;
  try {
    parsed = CreateBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: parsed.email,
    password: parsed.password,
    email_confirm: true,
  });
  if (createErr || !created.user) {
    console.error('[admin/users] create error', createErr);
    return NextResponse.json(
      { error: createErr?.message ?? 'create_failed' },
      { status: 400 },
    );
  }

  const { error: insertErr } = await admin
    .from('admin_users')
    .insert({ user_id: created.user.id, role: parsed.role });
  if (insertErr) {
    // rollback auth user pra não deixar órfão
    await admin.auth.admin.deleteUser(created.user.id);
    console.error('[admin/users] insert error', insertErr);
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    user_id: created.user.id,
    email: parsed.email,
    role: parsed.role,
  });
}
