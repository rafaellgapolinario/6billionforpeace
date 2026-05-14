/**
 * Versão compacta do hero pra páginas internas. Mesmo layout visual
 * da HeroHeart da home (cor, órbita das palavras, tamanho do coração)
 * mas menor e sem a tagline "We still have a choice".
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

export function HeroCompact() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-700 text-white" dir="ltr">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,191,255,0.18) 0%, rgba(10,37,64,0.0) 60%)',
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-10 sm:py-14">
        <div className="relative aspect-square w-[min(72vw,360px)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              role="img"
              aria-label="peace heart"
              className="heart-pulse w-[50%] text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
              fill="currentColor"
            >
              <path d="M16 27.2c-1.3-1-3.2-2.7-5.1-4.8-1.9-2-3.4-4-4.5-5.9-1.1-2-1.7-3.7-1.7-5.3 0-1.9.6-3.4 1.9-4.6 1.2-1.2 2.8-1.8 4.6-1.8 1.1 0 2.2.3 3.1.8.9.5 1.6 1.2 1.7 1.9.1-.7.8-1.4 1.7-1.9.9-.5 2-.8 3.1-.8 1.8 0 3.3.6 4.6 1.8 1.2 1.2 1.9 2.8 1.9 4.6 0 1.6-.6 3.3-1.7 5.3-1.1 1.9-2.6 3.9-4.5 5.9-1.9 2-3.8 3.8-5.1 4.8z" />
            </svg>
          </div>

          {PEACE_WORDS.map((w, i) => {
            const angle = (i / PEACE_WORDS.length) * 2 * Math.PI - Math.PI / 2;
            const radiusPct = 28;
            const x = 50 + Math.cos(angle) * radiusPct;
            const y = 50 + Math.sin(angle) * radiusPct;
            return (
              <span
                key={w.word}
                className="absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-xs font-medium tracking-wide text-white sm:text-sm"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-hidden
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
