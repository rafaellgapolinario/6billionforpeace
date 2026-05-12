import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-navy-800/60 p-8 shadow-2xl backdrop-blur">
        <div className="text-center">
          <h1 className="font-script text-4xl text-cyan-400">6billionforpeace</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">
            Admin panel
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
