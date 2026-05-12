/* Preview page — Rafael acessa /preview-logo pra escolher melhor logo */

type V = {
  key: string;
  fontClass: string;
  fontLabel: string;
};

const VARIANTS: V[] = [
  { key: 'dancing',   fontClass: 'font-[var(--font-dancing)] font-medium',   fontLabel: 'Dancing Script' },
  { key: 'sacramento', fontClass: 'font-[var(--font-sacramento)]',          fontLabel: 'Sacramento' },
  { key: 'yellowtail', fontClass: 'font-[var(--font-yellowtail)]',          fontLabel: 'Yellowtail' },
  { key: 'tangerine',  fontClass: 'font-[var(--font-tangerine)] font-bold', fontLabel: 'Tangerine (bold)' },
  { key: 'allura',     fontClass: 'font-[var(--font-script)]',              fontLabel: 'Allura (atual)' },
];

/**
 * SVG path completo de um "6+coração integrado" cursivo.
 * O traço entra no topo, desce em curva, e na base forma um coração em vez do laço fechado tradicional do "6".
 */
function SixHeart({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
      {/* Traço superior do "6" — entra fino e desce em curva */}
      <path d="M 44 6
               C 32 4, 22 12, 16 26
               C 12 38, 12 50, 16 60
               C 10 56, 6 50, 6 42
               C 6 26, 18 12, 36 8
               C 40 7, 44 6, 44 6 Z" />
      {/* Coração que substitui o laço inferior do "6" */}
      <path d="M 32 38
               C 22 38, 14 46, 14 58
               C 14 70, 22 80, 32 90
               C 42 80, 50 70, 50 58
               C 50 46, 42 38, 36 38
               C 33 38, 32 42, 32 44
               C 32 42, 31 38, 28 38 Z" />
    </svg>
  );
}

function LogoVariant({ v, size }: { v: V; size: 'sm' | 'md' | 'lg' }) {
  const textSize =
    size === 'lg' ? 'text-6xl sm:text-8xl' : size === 'md' ? 'text-5xl' : 'text-3xl';
  const svgSize =
    size === 'lg' ? 'h-[1.1em] w-[0.75em]' : size === 'md' ? 'h-[1.1em] w-[0.75em]' : 'h-[1.1em] w-[0.75em]';
  return (
    <div className="flex items-baseline gap-1 leading-none">
      <span className={`inline-flex items-center text-cyan-400 ${textSize}`}>
        <SixHeart className={svgSize} />
      </span>
      <span className={`${v.fontClass} text-white ${textSize}`}>billionforpeace</span>
    </div>
  );
}

export default function PreviewLogoPage() {
  return (
    <main className="min-h-screen bg-navy-900 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-12">
        <header>
          <h1 className="text-2xl font-bold">Logo preview</h1>
          <p className="mt-2 text-sm text-white/70">
            Cada variante usa uma fonte diferente para o &ldquo;billionforpeace&rdquo;
            combinada com o mesmo SVG cursivo do &ldquo;6+coração&rdquo;. Escolha a
            que mais aproxima do mockup <code>fototeste.jpeg</code>.
          </p>
        </header>

        {VARIANTS.map((v) => (
          <section key={v.key} className="space-y-4 rounded-2xl border border-white/10 bg-navy-800/40 p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">
              {v.key} · {v.fontLabel}
            </div>

            <div className="space-y-6 py-4">
              <LogoVariant v={v} size="lg" />
              <LogoVariant v={v} size="md" />
              <LogoVariant v={v} size="sm" />
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-white/10 bg-navy-800/40 p-6">
          <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">
            mockup do cliente (referência)
          </div>
          <img src="/fototeste.jpeg" alt="mockup" className="mt-4 max-w-xs rounded-lg" />
        </section>
      </div>
    </main>
  );
}
