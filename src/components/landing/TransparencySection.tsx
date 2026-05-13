import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ShieldCheck, EyeOff, Lock, Server } from 'lucide-react';

type Pillar = { title: string; body: string };

const ICONS = [ShieldCheck, EyeOff, Lock, Server];

export function TransparencySection() {
  const t = useTranslations('transparency');
  const pillars = t.raw('pillars') as Pillar[];

  return (
    <section id="transparency" className="bg-surface px-6 pt-12 pb-24 sm:pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">
            {t('title')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-balance text-2xl font-semibold text-navy-900 sm:text-3xl">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {pillars.map((p, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div
                key={i}
                className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-base font-semibold text-navy-900">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-navy-700">
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <Link
            href="/privacy"
            className="font-medium text-cyan-700 underline-offset-4 hover:underline"
          >
            {t('privacyLink')}
          </Link>
          <span aria-hidden className="text-navy-300">
            ·
          </span>
          <Link
            href="/terms"
            className="font-medium text-cyan-700 underline-offset-4 hover:underline"
          >
            {t('termsLink')}
          </Link>
        </div>
      </div>
    </section>
  );
}
