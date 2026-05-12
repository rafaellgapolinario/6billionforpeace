'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    const mount = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        theme: 'dark',
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
        'timeout-callback': () => setTurnstileToken(null),
        'error-callback': () => setTurnstileToken(null),
      });
    };
    if (window.turnstile) {
      mount();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(
      `script[src^="${TURNSTILE_SCRIPT_SRC}"]`,
    );
    if (!script) {
      script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', mount);
    return () => {
      script?.removeEventListener('load', mount);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json?.error === 'captcha') setError('Verificação anti-bot falhou. Aguarde e tente novamente.');
        else if (json?.error === 'rate_limit') setError('Muitas tentativas. Tente novamente em 15 minutos.');
        else if (json?.error === 'invalid_credentials') setError('Email ou senha incorretos.');
        else setError('Erro inesperado. Tente novamente.');
        setTurnstileToken(null);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        setLoading(false);
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Erro de rede. Tente novamente.');
      setLoading(false);
    }
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
      <div ref={containerRef} className="flex justify-center" />
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
