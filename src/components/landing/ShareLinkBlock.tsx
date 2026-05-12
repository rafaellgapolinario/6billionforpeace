'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Bloco "copy link and send to a friend" — usado na home e nas páginas internas.
 */
export function ShareLinkBlock({ url }: { url?: string }) {
  const t = useTranslations('shareLink');
  const [resolved, setResolved] = useState<string>(
    url ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://6billionforpeace.net',
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setResolved(window.location.origin + window.location.pathname);
    }
  }, [url]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(resolved);
      setCopied(true);
      toast.success(t('copied'));
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback for very old browsers
      const ta = document.createElement('textarea');
      ta.value = resolved;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      toast.success(t('copied'));
      setTimeout(() => setCopied(false), 2200);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-cyan-200 bg-white p-6 text-center shadow-sm sm:p-8">
      <h3 className="text-base font-semibold text-navy-900 sm:text-lg">
        {t('title')}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-navy-700">{t('body')}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={resolved}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full min-w-0 truncate rounded-full border border-navy-200 bg-navy-50 px-4 py-2.5 text-sm text-navy-800 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
          onClick={copy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-navy-800"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? t('copied') : t('copy')}
        </button>
      </div>
    </div>
  );
}
