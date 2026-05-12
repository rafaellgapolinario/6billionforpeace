'use client';

import { useState } from 'react';
import Link from 'next/link';

export function ForgotForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/forgot', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      if (json?.error === 'rate_limit') {
        setError('Muitas tentativas. Aguarde 1 hora.');
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-4 text-sm text-cyan-100">
        Se o email estiver cadastrado como admin, em alguns segundos chegará um link para definir a nova senha.
        <Link href="/admin/login" className="mt-3 block text-xs text-cyan-300 underline">
          ← Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !email}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? 'Enviando…' : 'Enviar link de recuperação'}
      </button>
      <Link href="/admin/login" className="block text-center text-xs text-white/60 hover:text-white">
        ← Voltar ao login
      </Link>
    </form>
  );
}
