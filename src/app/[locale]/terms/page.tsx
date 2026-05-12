import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { LegalShell } from '@/components/landing/LegalShell';

export default async function TermsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);
  return <LegalShell ns="terms" />;
}
