import { useTranslations } from 'next-intl';
import { Mountain } from 'lucide-react';

export function EverestSection() {
  const t = useTranslations('everest');
  return (
    <section className="bg-white px-6 pt-4 pb-12">
      <div className="mx-auto grid max-w-5xl items-center gap-10 rounded-3xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-500 px-8 py-14 text-navy-900 sm:grid-cols-[1fr_auto] sm:px-14 sm:py-20">
        <div>
          <p className="text-balance text-lg leading-relaxed sm:text-xl">
            {t('body')}
          </p>
          <div className="mt-8 flex items-center gap-5">
            <svg viewBox="0 0 48 56" className="h-28 w-24 shrink-0 sm:h-36 sm:w-28" aria-hidden>
              {/* Mastro */}
              <rect x="4" y="6" width="3" height="48" fill="#0A2540" rx="1" />
              {/* Bandeira branca */}
              <path
                d="M7 8 L42 12 L42 28 L7 24 Z"
                fill="white"
                stroke="#0A2540"
                strokeWidth="0.6"
              />
              {/* Coraçãozinho cyan no centro da bandeira */}
              <path
                d="M22 13.5 C19 13.5 17.5 15.5 17.5 17.5 C17.5 20.5 22 23 24.5 24.5 C27 23 31.5 20.5 31.5 17.5 C31.5 15.5 30 13.5 27 13.5 C25.5 13.5 24.6 14.3 24.5 15 C24.4 14.3 23.5 13.5 22 13.5 Z"
                fill="#00BFFF"
              />
            </svg>
            <span className="text-2xl font-semibold leading-tight text-navy-900 sm:text-3xl">
              {t('title')}
            </span>
          </div>
        </div>

        <div className="relative hidden h-32 w-32 shrink-0 items-center justify-center sm:flex">
          <Mountain className="absolute inset-0 h-full w-full text-white/40" strokeWidth={1.2} />
        </div>
      </div>
    </section>
  );
}
