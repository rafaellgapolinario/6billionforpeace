'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function ResetForm() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Supabase consome o token de recovery do hash e cria a session automaticamente.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      if (evt === 'PASSWORD_RECOVERY' || session) setHasSession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) {
      setError('Senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (pw !== pw2) {
      setError('Senhas não batem.');
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace('/admin/login'), 2500);
  }

  if (hasSession === false) {
    return (
      <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-200">
        Link inválido ou expirado. Solicite um novo no fluxo &ldquo;Esqueci a senha&rdquo;.
        <Link href="/admin/forgot" className="mt-3 block text-xs text-red-300 underline">
          Pedir novo link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-4 text-sm text-cyan-100">
        Senha atualizada. Redirecionando para o login…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/70">
          Nova senha
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-navy-900 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/70">
          Repita a senha
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-navy-900 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        />
      </label>
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !pw || !pw2 || hasSession !== true}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? 'Salvando…' : 'Definir senha'}
      </button>
    </form>
  );
}
