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
    { href: '/#participate',  label: t('participate') },
    { href: '/#transparency', label: t('transparency') },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-navy-900/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl" aria-label="6billionforpeace">
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguagePicker variant="light" showFlags={false} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? tHeader('menuClose') : tHeader('menuOpen')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden overflow-hidden border-t border-white/5 bg-navy-900 transition-[max-height] duration-300',
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
