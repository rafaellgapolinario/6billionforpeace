import { LanguagePicker } from '@/components/LanguagePicker';
import { Logo } from '@/components/Logo';

/**
 * Versão compacta do hero pra páginas internas.
 * Logo + LanguagePicker + coração pulsando com palavras de paz ao redor.
 */
const PEACE_WORDS = [
  { word: 'Shlama',  pos: { left: '50%', top: '12%' } },
  { word: 'Мир',     pos: { left: '22%', top: '28%' } },
  { word: 'Peace',   pos: { left: '78%', top: '28%' } },
  { word: 'Frieden', pos: { left: '18%', top: '52%' } },
  { word: 'Paz',     pos: { left: '82%', top: '52%' } },
  { word: 'Pace',    pos: { left: '30%', top: '74%' } },
  { word: 'שלום',    pos: { left: '70%', top: '74%' } },
  { word: 'سلام',    pos: { left: '36%', top: '88%' } },
  { word: '和平',     pos: { left: '64%', top: '88%' } },
] as const;

export function HeroCompact() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white" dir="ltr">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,191,255,0.18) 0%, rgba(10,37,64,0.0) 60%)',
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-10 sm:py-14">
        <Logo size="md" />

        <div className="mt-6">
          <LanguagePicker variant="light" showFlags={false} />
        </div>

        <div className="relative mt-8 aspect-square w-[min(72vw,360px)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              role="img"
              aria-label="peace heart"
              className="heart-pulse w-[62%] text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
              fill="currentColor"
            >
              <path d="M16 27.2c-1.3-1-3.2-2.7-5.1-4.8-1.9-2-3.4-4-4.5-5.9-1.1-2-1.7-3.7-1.7-5.3 0-1.9.6-3.4 1.9-4.6 1.2-1.2 2.8-1.8 4.6-1.8 1.1 0 2.2.3 3.1.8.9.5 1.6 1.2 1.7 1.9.1-.7.8-1.4 1.7-1.9.9-.5 2-.8 3.1-.8 1.8 0 3.3.6 4.6 1.8 1.2 1.2 1.9 2.8 1.9 4.6 0 1.6-.6 3.3-1.7 5.3-1.1 1.9-2.6 3.9-4.5 5.9-1.9 2-3.8 3.8-5.1 4.8z" />
            </svg>
          </div>

          {PEACE_WORDS.map((w) => (
            <span
              key={w.word}
              className="absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-xs font-medium tracking-wide text-white sm:text-sm"
              style={w.pos}
              aria-hidden
            >
              {w.word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
