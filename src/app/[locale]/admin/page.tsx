import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin/auth';
import { LogoutButton } from './LogoutButton';
import { IdleSignOut } from './IdleSignOut';
import { AdminShell } from './AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getAdminSession();
  if (!session) {
    redirect(`/${locale === 'en' ? '' : locale + '/'}admin/login`.replace(/\/+/g, '/'));
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-script text-2xl text-cyan-600">6billionforpeace</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-navy-500">
              Admin · {session!.email} · {session!.role}
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <AdminShell session={session} />
      <IdleSignOut />
    </main>
  );
}
