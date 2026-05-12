import { useTranslations } from 'next-intl';
import { Mountain } from 'lucide-react';

export function EverestSection() {
  const t = useTranslations('everest');
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 rounded-3xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-500 px-8 py-14 text-navy-900 sm:grid-cols-[1fr_auto] sm:px-14 sm:py-20">
        <div>
          <div className="mb-6 flex justify-start">
            <svg viewBox="0 0 24 24" className="h-12 w-12 fill-white" aria-hidden>
              <path d="M12 21s-7.5-4.6-7.5-11.2A4.8 4.8 0 0 1 12 5.6a4.8 4.8 0 0 1 7.5 4.2C19.5 16.4 12 21 12 21z" />
            </svg>
          </div>
          <p className="text-balance text-lg leading-relaxed sm:text-xl">
            {t('body')}
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/40 px-4 py-2 backdrop-blur-sm">
            <svg viewBox="0 0 32 32" className="h-5 w-7" aria-hidden>
              <rect x="2" y="6" width="2" height="22" fill="#0A2540" />
              <path d="M4 7 L26 9 L26 17 L4 15 Z" fill="white" stroke="#0A2540" strokeWidth="0.5" />
              <path
                d="M14 11s-3-1.8-3-4.5A1.9 1.9 0 0 1 14 5.5a1.9 1.9 0 0 1 3 1A1.9 1.9 0 0 1 17 11z"
                fill="#00BFFF"
                transform="translate(0,1)"
              />
            </svg>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-navy-800">
              White flag
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
