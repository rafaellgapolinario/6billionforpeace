'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }
  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-navy-200 px-4 py-2 text-xs font-medium text-navy-700 transition hover:border-navy-400 hover:text-navy-900"
    >
      Sign out
    </button>
  );
}
