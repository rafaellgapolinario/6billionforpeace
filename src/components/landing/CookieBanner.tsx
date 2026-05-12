'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const COOKIE_KEY = '6bfp_consent';

export function CookieBanner() {
  const t = useTranslations('cookie');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const has = document.cookie.includes(`${COOKIE_KEY}=`);
    setOpen(!has);
  }, []);

  const persist = (value: 'accept' | 'reject') => {
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=${oneYear}; samesite=lax`;
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-2xl border border-navy-100 bg-white p-5 shadow-2xl shadow-navy-900/15 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-navy-800">
          <p className="font-medium text-navy-900">{t('title')}</p>
          <p className="mt-1 text-navy-700">{t('body')}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => persist('reject')}
            className="rounded-full px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
          >
            {t('reject')}
          </button>
          <button
            onClick={() => persist('accept')}
            className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
