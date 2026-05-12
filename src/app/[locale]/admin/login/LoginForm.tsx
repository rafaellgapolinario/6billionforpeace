'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signErr) {
      setError(signErr.message);
      setLoading(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/70">
          Email
        </span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-navy-900 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/70">
          Password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-navy-900 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        />
      </label>
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
