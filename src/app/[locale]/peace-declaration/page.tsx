import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { PageShell } from '@/components/landing/PageShell';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'pages.declaration' });
  return { title: `${t('title')} — 6billionforpeace` };
}

export default async function PeaceDeclarationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('pages.declaration');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <PageShell>
      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-10 max-w-2xl text-balance text-xl font-medium text-cyan-700 sm:mt-12 sm:text-2xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 pb-16">
        <article className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-navy-800 sm:text-xl">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </section>

      <section className="bg-surface px-6 py-16">
        <div
          className="mx-auto max-w-4xl rounded-3xl px-8 py-12 text-center text-white sm:px-14 sm:py-16"
          style={{
            background:
              'linear-gradient(135deg, #00BFFF 0%, #1E90FF 50%, #0F3057 100%)',
          }}
        >
          <p className="mx-auto max-w-2xl text-balance text-xl italic leading-relaxed sm:text-2xl">
            &ldquo;{t('closing')}&rdquo;
          </p>
        </div>
      </section>
    </PageShell>
  );
}
