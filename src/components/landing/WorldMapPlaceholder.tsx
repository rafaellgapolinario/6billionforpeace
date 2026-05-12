import { useTranslations } from 'next-intl';

/**
 * D2 will replace this with MapLibre GL JS + a points layer fed from `stats.by_country`.
 * For D1 we render a soft placeholder so the page composition is testable end-to-end.
 */
export function WorldMapPlaceholder() {
  const t = useTranslations('map');
  return (
    <section className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">
          {t('title')}
        </h2>
        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-navy-100 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
          <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
            {t('loading')}
          </div>
        </div>
      </div>
    </section>
  );
}
