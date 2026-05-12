import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export function VolunteersSection() {
  const t = useTranslations('volunteers');
  return (
    <section id="participate" className="bg-white px-6 py-16">
      <div
        className="mx-auto max-w-4xl rounded-3xl px-8 py-14 text-center text-white sm:px-14 sm:py-20"
        style={{
          background: 'linear-gradient(135deg, #00BFFF 0%, #0098D8 100%)',
        }}
      >
        <h2 className="text-3xl font-semibold sm:text-4xl">{t('title')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed sm:text-lg">
          {t('body')}
        </p>
        <a
          href="#sign"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-navy-900 shadow-lg transition-transform hover:-translate-y-0.5"
        >
          {t('cta')}
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
