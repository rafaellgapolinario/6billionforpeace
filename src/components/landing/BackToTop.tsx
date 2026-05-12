'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const t = useTranslations('nav');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={t('backToTop')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 end-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-white shadow-xl shadow-navy-900/30 transition-transform hover:-translate-y-0.5 hover:bg-navy-800 sm:bottom-6 sm:end-6"
    >
      <ArrowUp size={18} />
    </button>
  );
}
