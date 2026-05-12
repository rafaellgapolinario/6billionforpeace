import { useTranslations } from 'next-intl';
import { LanguagePicker } from '@/components/LanguagePicker';

/**
 * Palavras de paz em alfabetos diferentes — FIXAS, não traduzem.
 */
const PEACE_WORDS = [
  { word: 'Shlama',  pos: { left: '50%',  top: '12%' } },
  { word: 'Мир',     pos: { left: '24%',  top: '24%' } },
  { word: 'Peace',   pos: { left: '78%',  top: '24%' } },
  { word: 'Frieden', pos: { left: '18%',  top: '40%' } },
  { word: 'Paz',     pos: { left: '82%',  top: '40%' } },
  { word: 'Pace',    pos: { left: '30%',  top: '58%' } },
  { word: 'שלום',    pos: { left: '72%',  top: '58%' } },
  { word: 'سلام',    pos: { left: '40%',  top: '78%' } },
  { word: '和平',     pos: { left: '64%',  top: '78%' } },
] as const;

export function HeroHeart() {
  const t = useTranslations('hero');

  return (
    <section id="top" className="relative isolate overflow-hidden" dir="ltr">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0098D8 0%, #00BFFF 40%, #4DD3FF 100%)',
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-12 sm:py-16">
        <div className="mb-8">
          <LanguagePicker variant="light" showFlags={false} />
        </div>

        {/* Heart + peace words */}
        <div className="relative aspect-square w-[min(86vw,520px)]">
          {/* big white heart in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              role="img"
              aria-label="peace heart"
              className="heart-pulse w-[68%] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
              fill="currentColor"
            >
              <path d="M16 28.4c-1.4-1.1-3.4-2.9-5.5-5.1-2-2.1-3.7-4.3-4.9-6.4-1.2-2.1-1.8-4-1.8-5.7 0-2 .7-3.7 2-5 1.3-1.3 3-1.9 4.9-1.9 1.2 0 2.4.3 3.4.9 1 .6 1.7 1.4 2 2.1.3-.7 1-1.5 2-2.1 1-.6 2.2-.9 3.4-.9 1.9 0 3.6.6 4.9 1.9 1.3 1.3 2 3 2 5 0 1.7-.6 3.6-1.8 5.7-1.2 2.1-2.9 4.3-4.9 6.4-2.1 2.2-4.1 4-5.5 5.1z" />
            </svg>
          </div>

          {/* peace words layered on top of the heart */}
          {PEACE_WORDS.map((w) => (
            <span
              key={w.word}
              className="absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-base font-medium text-white sm:text-lg"
              style={w.pos}
              aria-hidden
            >
              {w.word}
            </span>
          ))}
        </div>

        <h1 className="mt-10 max-w-3xl text-balance text-4xl font-semibold leading-tight text-white sm:text-6xl">
          {t('tagline')}
        </h1>
      </div>
    </section>
  );
}
