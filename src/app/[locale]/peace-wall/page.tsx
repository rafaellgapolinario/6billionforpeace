import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { Mail, Construction, Quote } from 'lucide-react';
import { PageShell } from '@/components/landing/PageShell';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'pages.peaceWall' });
  return { title: `${t('title')} — 6billionforpeace` };
}

// Frases curtas em inglês — fixas, símbolos do movimento
const SHORT_QUOTES = [
  'Every vision begins in imagination.',
  'A world without fear.',
  'Children growing in peace.',
  'No family destroyed by war.',
  'Humanity united.',
  'Peace between nations.',
  'A future worth protecting.',
  'More dialogue. Less violence.',
  'One planet. One humanity.',
  'The solution is peace.',
  'Together we build peace.',
];

// Frases multi-idioma (original + tradução PT)
const MULTI_LANG_QUOTES = [
  {
    lang: 'pt',
    original: '"Sonho que se sonha só é só um sonho. Mas sonho que se sonha junto é realidade."',
    author: 'Raul Seixas',
  },
  {
    lang: 'ru',
    original: 'Мир начинается с человечности.',
    translation: 'A paz começa com a humanidade.',
  },
  {
    lang: 'ar',
    original: 'السلام يبدأ عندما نرى بعضنا كبشر.',
    translation: 'A paz começa quando enxergamos uns aos outros como seres humanos.',
  },
  {
    lang: 'fr',
    original: 'La paix est le courage de choisir l’humanité.',
    translation: 'A paz é a coragem de escolher a humanidade.',
  },
  {
    lang: 'es',
    original: 'La paz no es debilidad. Es evolución humana.',
    translation: 'A paz não é fraqueza. É evolução humana.',
  },
  {
    lang: 'zh',
    original: '和平，是人类共同的未来。',
    translation: 'A paz é o futuro comum da humanidade.',
  },
];

// Posições/cores variadas pra dar dinâmica visual ao mural
const QUOTE_STYLES = [
  'bg-cyan-50 border-cyan-200 text-navy-900',
  'bg-white border-navy-100 text-navy-800',
  'bg-navy-900 border-navy-700 text-white',
  'bg-cyan-500 border-cyan-600 text-white',
  'bg-white border-cyan-200 text-cyan-700',
  'bg-navy-50 border-navy-200 text-navy-900',
];
const ROTATIONS = ['-rotate-1', 'rotate-0', 'rotate-1', '-rotate-2', 'rotate-2'];

export default async function PeaceWallPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);

  return (
    <PageShell>
      <section className="bg-white px-6 pt-20 pb-12 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Global Peace Mural
          </h1>
          <p className="mt-6 text-2xl font-medium text-cyan-700 sm:text-3xl">
            Imagine a world in peace
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-navy-700 sm:text-lg">
            A collective space where humanity shares what becomes possible when peace
            is real.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 pb-12">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-cyan-400 bg-gradient-to-br from-cyan-50 to-white px-8 py-10 text-center shadow-lg shadow-cyan-500/10 sm:px-12">
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-navy-800 sm:text-xl">
            Your voice matters. If you wish, you can send a short message or photo
            about peace. We may feature it in the Global Peace Mural.
          </p>
          <a
            href="mailto:mural@6billionforpeace.net"
            className="mt-6 inline-flex items-center gap-2 text-lg font-bold text-cyan-600 underline-offset-4 hover:underline sm:text-xl"
          >
            <Mail className="h-5 w-5" strokeWidth={2} />
            mural@6billionforpeace.net
          </a>
        </div>
      </section>

      {/* Mural com frases soltas em layout masonry */}
      <section className="bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {SHORT_QUOTES.map((q, i) => (
              <div
                key={q}
                className={`mb-6 inline-block w-full rounded-2xl border p-6 text-balance ${
                  QUOTE_STYLES[i % QUOTE_STYLES.length]
                } ${ROTATIONS[i % ROTATIONS.length]} break-inside-avoid`}
              >
                <Quote className="mb-2 h-5 w-5 opacity-60" strokeWidth={1.5} />
                <p className="text-lg font-medium leading-relaxed sm:text-xl">{q}</p>
              </div>
            ))}

            {MULTI_LANG_QUOTES.map((q, i) => (
              <div
                key={q.original}
                className={`mb-6 inline-block w-full rounded-2xl border p-6 text-balance ${
                  QUOTE_STYLES[(i + 2) % QUOTE_STYLES.length]
                } ${ROTATIONS[(i + 1) % ROTATIONS.length]} break-inside-avoid`}
                dir={q.lang === 'ar' ? 'rtl' : 'ltr'}
              >
                <p className="text-lg font-medium leading-relaxed sm:text-xl">
                  {q.original}
                </p>
                {q.translation && (
                  <p className="mt-3 text-sm italic opacity-80 sm:text-base" dir="ltr">
                    {q.translation}
                  </p>
                )}
                {q.author && (
                  <p className="mt-3 text-xs uppercase tracking-wider opacity-70" dir="ltr">
                    — {q.author}
                  </p>
                )}
              </div>
            ))}

            {/* placeholders "in construction" */}
            {[0, 1, 2].map((i) => (
              <div
                key={`construction-${i}`}
                className={`mb-6 inline-block w-full rounded-2xl border-2 border-dashed border-navy-200 bg-white/50 p-6 text-center text-navy-400 break-inside-avoid ${
                  ROTATIONS[i % ROTATIONS.length]
                }`}
              >
                <Construction className="mx-auto h-6 w-6 opacity-50" strokeWidth={1.5} />
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                  In construction
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
