'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Overlay de confirmação pós-assinatura: blur leve no fundo + tela branca
 * com coração + mensagem. Some sozinho depois de ~3.5s e chama onDone.
 */
export function ThankYouOverlay({ onDone }: { onDone: () => void }) {
  const t = useTranslations('thankYou');
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Bloqueia scroll enquanto overlay tá ativo
    document.body.style.overflow = 'hidden';
    const t1 = setTimeout(() => setLeaving(true), 3000);
    const t2 = setTimeout(() => {
      document.body.style.overflow = '';
      onDone();
    }, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = '';
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-md transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Thank you for signing"
    >
      <div className="thanks-fade max-w-xl text-center">
        <svg
          viewBox="0 0 32 32"
          className="thanks-heart mx-auto h-32 w-32 text-cyan-500 drop-shadow-[0_8px_24px_rgba(0,191,255,0.35)] sm:h-40 sm:w-40"
          fill="currentColor"
          aria-hidden
        >
          <path d="M16 27.2c-1.3-1-3.2-2.7-5.1-4.8-1.9-2-3.4-4-4.5-5.9-1.1-2-1.7-3.7-1.7-5.3 0-1.9.6-3.4 1.9-4.6 1.2-1.2 2.8-1.8 4.6-1.8 1.1 0 2.2.3 3.1.8.9.5 1.6 1.2 1.7 1.9.1-.7.8-1.4 1.7-1.9.9-.5 2-.8 3.1-.8 1.8 0 3.3.6 4.6 1.8 1.2 1.2 1.9 2.8 1.9 4.6 0 1.6-.6 3.3-1.7 5.3-1.1 1.9-2.6 3.9-4.5 5.9-1.9 2-3.8 3.8-5.1 4.8z" />
        </svg>
        <p className="mt-8 text-balance text-xl font-medium leading-relaxed text-navy-900 sm:text-2xl">
          {t('title')}
          <br />
          {t('body')}
        </p>
      </div>
    </div>
  );
}
