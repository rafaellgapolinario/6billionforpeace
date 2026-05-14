import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { Mail, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/landing/PageShell';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'pages.donations' });
  return { title: `${t('title')} — 6billionforpeace` };
}

export default async function DonationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('pages.donations');

  return (
    <PageShell>
      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-xl font-medium text-cyan-700 sm:text-2xl">
            {t('subtitle')}
          </p>

          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-navy-700 sm:text-lg">
            {t('intro')}
          </p>

          <a
            href="mailto:6billionforpeace@gmail.com"
            className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-cyan-600 underline-offset-4 hover:underline sm:text-lg"
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
            6billionforpeace@gmail.com
          </a>

          <p className="mx-auto mt-12 max-w-2xl text-balance text-lg italic leading-relaxed text-navy-800 sm:text-xl">
            &ldquo;{t('quote')}&rdquo;
          </p>
        </div>
      </section>

      <section className="bg-surface px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border-2 border-cyan-300 bg-white px-8 py-12 text-center shadow-lg shadow-cyan-500/10 sm:px-12 sm:py-14">
          <Sparkles className="mx-auto h-10 w-10 text-cyan-500" strokeWidth={1.5} />
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg font-medium leading-relaxed text-navy-900 sm:text-xl">
            {t('highlight')}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div
          className="mx-auto max-w-4xl rounded-3xl px-8 py-12 text-center text-white sm:px-14 sm:py-16"
          style={{
            background:
              'linear-gradient(135deg, #00BFFF 0%, #1E90FF 50%, #0F3057 100%)',
          }}
        >
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed sm:text-xl">
            {t('future')}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
