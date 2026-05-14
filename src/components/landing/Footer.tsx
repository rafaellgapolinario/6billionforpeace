import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LanguagePicker } from '@/components/LanguagePicker';

export function Footer() {
  const t = useTranslations('footer');
  const links = [
    { href: '/',                 label: t('home'),         external: false },
    { href: '/participation',    label: t('participate'),  external: false },
    { href: '/transparency',     label: t('transparency'), external: false },
    { href: '/donations',        label: t('donations'),    external: false },
    { href: '/peace-wall',       label: t('peaceWall'),    external: false },
    { href: '/peace-declaration', label: t('declaration'), external: false },
  ];
  return (
    <footer className="bg-navy-900 px-6 py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto_auto]">
        <div className="space-y-4">
          <div className="text-2xl">
            <Logo variant="light" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            {t('mission')}
          </p>
        </div>

        <nav className="text-sm">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            {t('linksTitle')}
          </h4>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                {l.href.startsWith('#') ? (
                  <a href={l.href} className="text-white/80 hover:text-white">
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href} className="text-white/80 hover:text-white">
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            {t('language')}
          </h4>
          <LanguagePicker variant="light" showFlags={false} />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl space-y-3 text-center text-[11px] leading-relaxed text-white/60">
        <p className="italic">{t('inspired')}</p>
        <p>{t('thanks')}</p>
      </div>

      <div className="mx-auto mt-6 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} 6billionforpeace · {t('rightsReserved')}
      </div>
    </footer>
  );
}
