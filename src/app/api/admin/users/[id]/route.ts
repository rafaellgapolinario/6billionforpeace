import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PatchBody = z.object({
  role: z.enum(['admin', 'owner']).optional(),
  password: z.string().min(8).max(72).optional(),
});

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  if (id === session.userId) {
    return NextResponse.json({ error: 'cannot_delete_self' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  await admin.from('admin_users').delete().eq('user_id', id);
  await admin.auth.admin.deleteUser(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session || session.role !== 'owner') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  let parsed;
  try {
    parsed = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (parsed.role) {
    if (id === session.userId && parsed.role !== 'owner') {
      return NextResponse.json({ error: 'cannot_demote_self' }, { status: 400 });
    }
    const { error } = await admin
      .from('admin_users')
      .update({ role: parsed.role })
      .eq('user_id', id);
    if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }
  if (parsed.password) {
    const { error } = await admin.auth.admin.updateUserById(id, {
      password: parsed.password,
    });
    if (error) return NextResponse.json({ error: 'password_update_failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
