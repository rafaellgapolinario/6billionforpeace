import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { listCountries } from '@/lib/countries';

import { Header } from '@/components/landing/Header';
import { HeroHeart } from '@/components/landing/HeroHeart';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { CallSection } from '@/components/landing/CallSection';
import { PrinciplesSection } from '@/components/landing/PrinciplesSection';
import { TransparencySection } from '@/components/landing/TransparencySection';
import { VolunteersSection } from '@/components/landing/VolunteersSection';
import { SignatureForm } from '@/components/landing/SignatureForm';
import { LiveCounter } from '@/components/landing/LiveCounter';
import { WorldMap } from '@/components/landing/WorldMap';
import { EverestSection } from '@/components/landing/EverestSection';
import { Footer } from '@/components/landing/Footer';
import { CookieBanner } from '@/components/landing/CookieBanner';
import { BackToTop } from '@/components/landing/BackToTop';
import { ShareLinkBlock } from '@/components/landing/ShareLinkBlock';

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);

  const h = await headers();
  const ipCountry =
    h.get('x-vercel-ip-country') ??
    h.get('cf-ipcountry') ??
    '';

  let initialStats = undefined;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('stats')
      .select('total_signatures, by_country, updated_at')
      .eq('id', 1)
      .single();
    if (data) initialStats = data;
  } catch {
    // first deploy: stats might not be reachable yet
  }

  return (
    <>
      <Header />
      <main>
        <HeroHeart />
        <SolutionSection />
        <CallSection />
        <PrinciplesSection />
        <TransparencySection />
        <VolunteersSection />

        <section id="sign" className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="space-y-8">
              <LiveCounter initialStats={initialStats} />
              <WorldMap initialStats={initialStats} />
            </div>
            <SignatureForm
              initialCountry={ipCountry || undefined}
              countries={listCountries(locale)}
            />
          </div>
        </section>

        <EverestSection />

        <section className="bg-white px-6 pt-2 pb-16">
          <ShareLinkBlock />
        </section>
      </main>
      <Footer />
      <CookieBanner />
      <BackToTop />
    </>
  );
}
