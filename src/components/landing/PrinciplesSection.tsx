import { useTranslations } from 'next-intl';
import { Ban, Scale, Globe2 } from 'lucide-react';

export function PrinciplesSection() {
  const t = useTranslations('principles');
  const cards = [
    { Icon: Ban,    label: t('noRevolutions') },
    { Icon: Scale,  label: t('noIdeologies') },
    { Icon: Globe2, label: t('withoutWar') },
  ];

  return (
    <section id="principles" className="bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">
          {t('title')}
        </h2>

        <ul className="mt-12 grid gap-5 sm:grid-cols-3">
          {cards.map(({ Icon, label }) => (
            <li
              key={label}
              className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm shadow-navy-900/[.04]"
            >
              <Icon className="mx-auto h-9 w-9 text-cyan-500" strokeWidth={1.6} />
              <p className="mt-4 text-lg font-medium text-navy-900">{label}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-base text-muted">{t('sovereignty')}</p>

        <div className="mt-12 inline-flex flex-col items-center rounded-2xl bg-navy-900 px-10 py-8 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            {t('requirementTitle')}
          </span>
          <span className="mt-2 text-3xl font-semibold sm:text-4xl">
            {t('requirementBody')}
          </span>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-balance text-base leading-relaxed text-navy-700">
          {t('maturity')}
        </p>
      </div>
    </section>
  );
}
