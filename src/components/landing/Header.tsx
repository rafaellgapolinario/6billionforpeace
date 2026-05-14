'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/Logo';
import { LanguagePicker } from '@/components/LanguagePicker';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('header.nav');
  const tHeader = useTranslations('header');
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/#solution',     label: t('solution') },
    { href: '/#principles',   label: t('principles') },
    { href: '/#sign',         label: t('participate') },
    { href: '/#transparency', label: t('transparency') },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-navy-900">
      <div className="relative mx-auto flex h-28 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex-shrink-0">
          <LanguagePicker variant="light" showFlags={false} compact />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Link
            href="/"
            className="pointer-events-auto"
            aria-label="6billionforpeace"
          >
            <Logo variant="light" size="sm" className="sm:h-14" />
          </Link>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? tHeader('menuClose') : tHeader('menuOpen')}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white transition-colors hover:bg-white/5"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-x-0 top-full overflow-hidden border-t border-white/5 bg-navy-900 shadow-2xl shadow-black/40 transition-[max-height] duration-300',
          open ? 'max-h-72' : 'max-h-0',
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5 hover:text-white"
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
