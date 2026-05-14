import { useTranslations } from 'next-intl';
import { Scale, HeartHandshake, Globe2 } from 'lucide-react';
import { HeartButton } from '@/components/HeartButton';

export function PrinciplesSection() {
  const t = useTranslations('principles');

  return (
    <section id="principles" className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-cyan-600 sm:text-3xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-navy-700 sm:text-lg">
          {t('subtitle')}
        </p>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
          <li className="rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm shadow-navy-900/[.04]">
            <Scale className="mx-auto h-9 w-9 text-navy-900" strokeWidth={1.6} />
            <h3 className="mt-4 text-xl font-semibold text-navy-900">
              {t('noIdeologies')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-700">
              {t('sovereignty')}
            </p>
          </li>

          <li className="rounded-2xl border border-cyan-200 bg-cyan-50 p-8 text-center shadow-sm shadow-cyan-500/[.06]">
            <HeartHandshake className="mx-auto h-9 w-9 text-navy-900" strokeWidth={1.6} />
            <h3 className="mt-4 text-xl font-semibold text-navy-900">
              {t('everyLifeTitle')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-700">
              {t('everyLifeBody')}
            </p>
          </li>

          <li className="rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm shadow-navy-900/[.04]">
            <Globe2 className="mx-auto h-9 w-9 text-navy-900" strokeWidth={1.6} />
            <h3 className="mt-4 text-xl font-semibold text-navy-900">
              {t('noWar')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-700">
              {t('maturity')}
            </p>
          </li>
        </ul>

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
