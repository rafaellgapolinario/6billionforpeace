'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Home } from 'lucide-react';

/**
 * Botão flutuante: em qualquer página, leva o usuário de volta pra raiz
 * do site no idioma atual. Aparece após scroll > 600px.
 */
export function BackToTop() {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const isHome = pathname === '/';

  const onClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <button
      type="button"
      aria-label={t('backToTop')}
      onClick={onClick}
      className="fixed bottom-20 end-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-white shadow-xl shadow-navy-900/30 transition-transform hover:-translate-y-0.5 hover:bg-navy-800 sm:bottom-6 sm:end-6"
    >
      <Home size={18} />
    </button>
  );
}
