'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales, localeMeta, type Locale } from '@/i18n/locales';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguagePicker({
  variant = 'light',
  showFlags = false,
  compact = false,
}: {
  variant?: 'light' | 'dark';
  showFlags?: boolean;
  /** Esconde o nome do idioma no mobile, mostra só o globo + chevron. */
  compact?: boolean;
}) {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [, start] = useTransition();

  const change = (next: Locale) => {
    setOpen(false);
    start(() => router.replace(pathname, { locale: next }));
  };

  const triggerCls =
    variant === 'light'
      ? 'text-white/90 hover:text-white border-white/15 hover:border-white/30'
      : 'text-navy-800 hover:text-navy-900 border-navy-200 hover:border-navy-300';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('languagePicker')}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
          triggerCls,
        )}
      >
        <Globe size={16} />
        <span className={cn('font-medium', compact && 'hidden sm:inline')}>
          {localeMeta[current].native}
        </span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <ul
            role="listbox"
            className={cn(
              'absolute z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/10 bg-navy-900 py-1 shadow-2xl shadow-black/40',
              compact ? 'left-0' : 'right-0',
            )}
          >
            {locales.map((lc) => (
              <li key={lc}>
                <button
                  type="button"
                  role="option"
                  aria-selected={lc === current}
                  onClick={() => change(lc)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/5 hover:text-white"
                  dir="ltr"
                >
                  <span className="flex items-center gap-2">
                    {showFlags && (
                      <span aria-hidden className="text-base">
                        {localeMeta[lc].flag}
                      </span>
                    )}
                    <span>{localeMeta[lc].native}</span>
                  </span>
                  {lc === current && <Check size={14} className="text-cyan-400" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
