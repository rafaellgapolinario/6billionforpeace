import { useTranslations } from 'next-intl';
import { Scale } from 'lucide-react';
import { HeartButton } from '@/components/HeartButton';

export function PrinciplesSection() {
  const t = useTranslations('principles');

  return (
    <section id="principles" className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-cyan-600 sm:text-3xl">
          {t('title')}
        </h2>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          <li className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm shadow-navy-900/[.04]">
            <Scale className="mx-auto h-9 w-9 text-navy-700" strokeWidth={1.6} />
            <p className="mt-4 text-lg font-medium text-navy-900">
              {t('noIdeologies')}
            </p>
          </li>
          <li className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm shadow-navy-900/[.04]">
            <span className="mx-auto block text-4xl leading-none" aria-hidden>
              🌍
            </span>
            <p className="mt-4 text-lg font-medium text-navy-900">{t('noWar')}</p>
          </li>
        </ul>

        <p className="mx-auto mt-10 max-w-3xl text-balance text-lg leading-relaxed text-navy-800 sm:text-xl">
          {t('sovereignty')}
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-balance text-lg leading-relaxed text-navy-800 sm:text-xl">
          {t('maturity')}
        </p>

        <div className="mt-12 inline-flex flex-col items-center rounded-2xl bg-navy-900 px-10 py-8 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            {t('requirementTitle')}
          </span>
          <span className="mt-2 text-3xl font-semibold sm:text-4xl">
            {t('requirementBody')}
          </span>
        </div>

        <div className="mt-12">
          <HeartButton href="#sign">{t('cta')}</HeartButton>
        </div>
      </div>
    </section>
  );
}
