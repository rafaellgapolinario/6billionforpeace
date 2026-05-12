import type { Metadata } from 'next';
import {
  Allura,
  Dancing_Script,
  Sacramento,
  Tangerine,
  Yellowtail,
  Inter,
  Noto_Sans_Arabic,
  Noto_Sans_SC,
} from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { MountedToaster } from '@/components/MountedToaster';
import { routing } from '@/i18n/routing';
import { localeMeta } from '@/i18n/locales';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const allura = Allura({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
});

const sacramento = Sacramento({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sacramento',
  display: 'swap',
});

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tangerine',
  display: 'swap',
});

const yellowtail = Yellowtail({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-yellowtail',
  display: 'swap',
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

const notoSc = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-zh',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://6billionforpeace.net'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = localeMeta[locale].dir;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${allura.variable} ${dancingScript.variable} ${sacramento.variable} ${tangerine.variable} ${yellowtail.variable} ${notoArabic.variable} ${notoSc.variable}`}
    >
      <body className="min-h-full bg-background text-navy-900 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {props.children}
          <MountedToaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
