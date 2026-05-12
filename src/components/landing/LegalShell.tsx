import Link from 'next/link';
import { useTranslations } from 'next-intl';

type Section = { heading: string; body: string };

export function LegalShell({
  ns,
}: {
  ns: 'privacy' | 'terms';
}) {
  const t = useTranslations('legal');
  const sections = t.raw(`${ns}.sections`) as Section[];
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-cyan-700 underline-offset-4 hover:underline"
        >
          {t('backToHome')}
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-navy-900 sm:text-4xl">
          {t(`${ns}.title`)}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-navy-500">
          {t('updated')}
        </p>
        <p className="mt-8 text-base leading-relaxed text-navy-700">
          {t(`${ns}.intro`)}
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-navy-900">
                {s.heading}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-navy-700">
                {s.body}
              </p>
            </section>
          ))}
        </div>
        <p className="mt-12 rounded-2xl border border-navy-100 bg-white px-5 py-4 text-sm text-navy-700">
          {t(`${ns}.contact`)}
        </p>
      </div>
    </main>
  );
}
