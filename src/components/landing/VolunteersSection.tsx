import { useTranslations } from 'next-intl';

export function VolunteersSection() {
  const t = useTranslations('volunteers');
  return (
    <section id="participate" className="bg-white px-6 py-16">
      <div
        className="mx-auto max-w-4xl rounded-3xl px-8 py-16 text-center text-white sm:px-14 sm:py-20"
        style={{
          background: 'linear-gradient(135deg, #00BFFF 0%, #0098D8 100%)',
        }}
      >
        <h2 className="text-3xl font-semibold sm:text-4xl">{t('title')}</h2>
        <p className="mt-4 text-balance text-xl font-light sm:text-2xl">
          {t('subtitle')}
        </p>
        <span
          className="mt-8 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-[0.25em] text-navy-900"
          style={{
            background: '#34D399',
            boxShadow:
              '0 0 0 3px rgba(52,211,153,0.35), 0 0 24px rgba(52,211,153,0.55)',
          }}
        >
          {t('comingSoon')}
        </span>
      </div>
    </section>
  );
}
