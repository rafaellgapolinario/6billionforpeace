import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { HeroCompact } from '@/components/landing/HeroCompact';
import { HumansForPeaceSection } from '@/components/landing/HumansForPeaceSection';
import { ShareLinkBlock } from '@/components/landing/ShareLinkBlock';
import { BackToTop } from '@/components/landing/BackToTop';

/**
 * Shell padrão pras 4 páginas internas (Participation, Transparency,
 * Donations, Peace wall). Logo + LanguagePicker + hero compacto + children
 * + Humans for peace + share link + footer.
 */
export function PageShell({
  children,
  showShareLink = true,
  showHumansForPeace = true,
}: {
  children: React.ReactNode;
  showShareLink?: boolean;
  showHumansForPeace?: boolean;
}) {
  return (
    <>
      <Header />
      <main>
        <HeroCompact />
        {children}
        {showHumansForPeace && <HumansForPeaceSection />}
        {showShareLink && (
          <section className="bg-white px-6 py-16">
            <ShareLinkBlock />
          </section>
        )}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
