import { headers } from 'next/headers';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { listCountries } from '@/lib/countries';
import { PageShell } from '@/components/landing/PageShell';
import { SignatureForm } from '@/components/landing/SignatureForm';
import { LiveCounter } from '@/components/landing/LiveCounter';
import { WorldMap } from '@/components/landing/WorldMap';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'pages.participation' });
  return { title: `${t('title')} — 6billionforpeace` };
}

export default async function ParticipationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);

  const h = await headers();
  const ipCountry =
    h.get('x-vercel-ip-country') ?? h.get('cf-ipcountry') ?? '';

  let initialStats = undefined;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('stats')
      .select('total_signatures, by_country, updated_at')
      .eq('id', 1)
      .single();
    if (data) initialStats = data;
  } catch {}

  return (
    <PageShell>
      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            What It Means to Participate
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-navy-700 sm:text-xl">
            To participate is to make a conscious choice:
          </p>
          <ul className="mx-auto mt-6 max-w-xl space-y-3 text-left text-lg text-navy-800 sm:text-xl">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
              <span>To reject war</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
              <span>To affirm peace</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
              <span>To stand with humanity</span>
            </li>
          </ul>
          <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-navy-700 sm:text-xl">
            Your participation is personal, meaningful, and global.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-navy-700 sm:text-xl">
            You are not joining an organization.
            <br />
            You are standing with humanity.
          </p>
        </div>
      </section>

      <section id="sign" className="bg-surface px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Make Your Voice Heard for Global Peace
          </h2>
        </div>
        <div className="mx-auto mt-12 max-w-2xl">
          <SignatureForm
            initialCountry={ipCountry || undefined}
            countries={listCountries(locale)}
          />
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <LiveCounter initialStats={initialStats} />
          <WorldMap initialStats={initialStats} />
        </div>
      </section>
    </PageShell>
  );
}
