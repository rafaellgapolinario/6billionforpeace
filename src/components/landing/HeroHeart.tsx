import { useTranslations } from 'next-intl';

/**
 * Decorative "peace" words orbiting the heart.
 * THESE LABELS ARE FIXED — they are visual symbols of universality,
 * not translated strings tied to the page locale.
 */
const PEACE_WORDS = [
  { word: 'Shlama', script: 'latin' },
  { word: 'Мир', script: 'cyrillic' },
  { word: 'Peace', script: 'latin' },
  { word: 'Frieden', script: 'latin' },
  { word: 'Paz', script: 'latin' },
  { word: 'שלום', script: 'hebrew' },
  { word: 'Pace', script: 'latin' },
  { word: '和平', script: 'cjk' },
  { word: 'سلام', script: 'arabic' },
] as const;

export function HeroHeart() {
  const t = useTranslations('hero');

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-navy-900 text-white"
      dir="ltr"
    >
      {/* radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,191,255,0.18) 0%, rgba(10,37,64,0.0) 60%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center sm:py-24">
        {/* peace-words ring */}
        <div className="relative aspect-square w-[min(92vw,560px)]">
          {PEACE_WORDS.map((w, i) => {
            const angle = (i / PEACE_WORDS.length) * 2 * Math.PI - Math.PI / 2;
            const radiusPct = 46;
            const x = 50 + Math.cos(angle) * radiusPct;
            const y = 50 + Math.sin(angle) * radiusPct;
            return (
              <span
                key={w.word}
                className="absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-sm font-light tracking-wide text-white/65 sm:text-base"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-hidden
              >
                {w.word}
              </span>
            );
          })}

          {/* heart */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              role="img"
              aria-label="peace heart"
              className="heart-pulse w-[44%] text-white"
              fill="currentColor"
            >
              <path d="M12 21s-7.5-4.6-7.5-11.2A4.8 4.8 0 0 1 12 5.6a4.8 4.8 0 0 1 7.5 4.2C19.5 16.4 12 21 12 21z" />
            </svg>
          </div>
        </div>

        <p className="mt-10 max-w-xl text-balance text-base font-light text-white/70 sm:text-lg">
          {t('tagline')}
        </p>
      </div>
    </section>
  );
}
