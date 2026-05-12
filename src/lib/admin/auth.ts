import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export type AdminSession = {
  userId: string;
  email: string;
  role: 'admin' | 'owner';
};

/**
 * Reads the current user from the SSR cookie and confirms they are listed in
 * bfp.admin_users. Returns null when either step fails. Uses the service-role
 * client for the admin_users lookup so RLS can stay locked down to admins only.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) return null;

  const admin = createSupabaseAdminClient();
  const { data, error: roleErr } = await admin
    .from('admin_users')
    .select('role')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  if (roleErr || !data) return null;

  return {
    userId: userData.user.id,
    email: userData.user.email ?? '',
    role: data.role as 'admin' | 'owner',
  };
}
