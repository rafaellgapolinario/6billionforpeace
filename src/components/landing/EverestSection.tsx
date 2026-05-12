import { useTranslations } from 'next-intl';
import { ArrowRight, Mountain } from 'lucide-react';

export function EverestSection() {
  const t = useTranslations('everest');
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 rounded-3xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-500 px-8 py-14 text-navy-900 sm:grid-cols-[1fr_auto] sm:px-14 sm:py-20">
        <div>
          <p className="text-balance text-lg leading-relaxed sm:text-xl">
            {t('body')}
          </p>
          <p className="mt-4 text-2xl font-semibold sm:text-3xl">
            {t('highlight')}
          </p>
          <a
            href="#sign"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-navy-800"
          >
            {t('cta')}
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="relative hidden h-32 w-32 shrink-0 items-center justify-center sm:flex">
          <Mountain className="absolute inset-0 h-full w-full text-white/40" strokeWidth={1.2} />
          <svg viewBox="0 0 24 24" className="relative h-14 w-14 fill-white" aria-hidden>
            <path d="M12 21s-7.5-4.6-7.5-11.2A4.8 4.8 0 0 1 12 5.6a4.8 4.8 0 0 1 7.5 4.2C19.5 16.4 12 21 12 21z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
