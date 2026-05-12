import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export default async function ConfirmedPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { locale } = await props.params;
  const { ok } = await props.searchParams;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'confirmed' });
  const success = ok === '1';

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-md text-center">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            success ? 'bg-cyan-500 text-white' : 'bg-navy-200 text-navy-700'
          }`}
        >
          {success ? '✓' : '!'}
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-navy-900">
          {success ? t('title') : t('invalidTitle')}
        </h1>
        <p className="mt-3 text-base text-navy-700">
          {success ? t('body') : t('invalidBody')}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
        >
          {t('cta')}
        </Link>
      </div>
    </main>
  );
}
