import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export function SolutionSection() {
  const t = useTranslations('solution');
  return (
    <section id="solution" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">
          {t('title')}
        </h2>
        <div className="mt-8 space-y-5 text-balance text-lg leading-relaxed text-navy-800 sm:text-xl">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
          <p>{t('p4')}</p>
          <p>{t('p5')}</p>
          <p className="font-medium text-navy-900">{t('p6')}</p>
        </div>

        <a
          href="#transparency"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-navy-900 shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5 hover:bg-cyan-400"
        >
          {t('cta')}
          <Heart size={16} className="fill-navy-900" />
        </a>
      </div>
    </section>
  );
}
