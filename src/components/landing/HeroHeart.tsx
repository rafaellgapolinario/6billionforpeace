import { useTranslations } from 'next-intl';
import { Logo } from '@/components/Logo';
import { LanguagePicker } from '@/components/LanguagePicker';

/**
 * Palavras de paz em alfabetos diferentes — FIXAS, não traduzem.
 * São símbolos visuais de universalismo.
 */
const PEACE_WORDS = [
  { word: 'Shlama' },
  { word: 'Мир' },
  { word: 'Peace' },
  { word: 'Frieden' },
  { word: 'Paz' },
  { word: 'שלום' },
  { word: 'Pace' },
  { word: '和平' },
  { word: 'سلام' },
] as const;

export function HeroHeart() {
  const t = useTranslations('hero');

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-navy-900 text-white"
      dir="ltr"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,191,255,0.18) 0%, rgba(10,37,64,0.0) 60%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
        <Logo variant="light" size="lg" />

        <div className="mt-6">
          <LanguagePicker variant="light" showFlags={false} />
        </div>

        <div className="relative mt-10 aspect-square w-[min(88vw,520px)]">
          {PEACE_WORDS.map((w, i) => {
            const angle = (i / PEACE_WORDS.length) * 2 * Math.PI - Math.PI / 2;
            const radiusPct = 36;
            const x = 50 + Math.cos(angle) * radiusPct;
            const y = 50 + Math.sin(angle) * radiusPct;
            return (
              <span
                key={w.word}
                className="absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-sm font-light tracking-wide text-white/70 sm:text-base"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-hidden
              >
                {w.word}
              </span>
            );
          })}

          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              role="img"
              aria-label="peace heart"
              className="heart-pulse w-[36%] text-white"
              fill="currentColor"
            >
              <path d="M16 28.4c-1.4-1.1-3.4-2.9-5.5-5.1-2-2.1-3.7-4.3-4.9-6.4-1.2-2.1-1.8-4-1.8-5.7 0-2 .7-3.7 2-5 1.3-1.3 3-1.9 4.9-1.9 1.2 0 2.4.3 3.4.9 1 .6 1.7 1.4 2 2.1.3-.7 1-1.5 2-2.1 1-.6 2.2-.9 3.4-.9 1.9 0 3.6.6 4.9 1.9 1.3 1.3 2 3 2 5 0 1.7-.6 3.6-1.8 5.7-1.2 2.1-2.9 4.3-4.9 6.4-2.1 2.2-4.1 4-5.5 5.1z" />
            </svg>
          </div>
        </div>

        <h1 className="mt-12 max-w-3xl text-balance text-4xl font-semibold leading-tight text-white sm:text-6xl">
          {t('tagline')}
        </h1>
      </div>
    </section>
  );
}
