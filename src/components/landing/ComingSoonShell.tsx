import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { ShareLinkBlock } from '@/components/landing/ShareLinkBlock';
import { HeartButton } from '@/components/HeartButton';

export async function ComingSoonShell({
  title,
  lead,
}: {
  title: string;
  lead: string;
}) {
  const t = await getTranslations('comingSoon');
  const tLegal = await getTranslations('legal');
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-28">
          <span className="inline-flex items-center rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
            {t('label')}
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight text-navy-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-navy-700">
            {lead}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base text-navy-500">{t('body')}</p>

          <div className="mt-10 flex justify-center">
            <HeartButton href="/#sign">Sign for peace</HeartButton>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-cyan-700 hover:text-cyan-800"
          >
            {tLegal('backToHome')}
          </Link>
        </section>

        <section className="px-6 pb-20">
          <ShareLinkBlock />
        </section>
      </main>
      <Footer />
    </>
  );
}
