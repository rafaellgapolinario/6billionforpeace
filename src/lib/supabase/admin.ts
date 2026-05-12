import { createClient } from '@supabase/supabase-js';

/**
 * Server-only admin client (bypasses RLS).
 * NEVER expose this to the browser. Use only inside API routes / server actions.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase URL or SERVICE_ROLE_KEY env vars');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
