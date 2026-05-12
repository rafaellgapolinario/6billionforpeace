'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('header.nav');
  const tHeader = useTranslations('header');
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '#solution',     label: t('solution') },
    { href: '#principles',   label: t('principles') },
    { href: '#participate',  label: t('participate') },
    { href: '#transparency', label: t('transparency') },
  ];

  return (
    <header className="relative z-30 border-b border-white/5 bg-navy-900">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-6 sm:py-8">
        <a href="#top" aria-label="6billionforpeace home">
          <Logo variant="light" size="lg" />
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? tHeader('menuClose') : tHeader('menuOpen')}
          className="mt-4 inline-flex h-10 w-12 items-center justify-center rounded-md bg-white text-navy-900 shadow-sm lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="mt-4 hidden items-center gap-7 lg:flex">
          {navItems.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {it.label}
            </a>
          ))}
        </nav>
      </div>

      <div
        className={cn(
          'lg:hidden overflow-hidden border-t border-white/5 bg-navy-900 transition-[max-height] duration-300',
          open ? 'max-h-72' : 'max-h-0',
        )}
      >
        <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
          {navItems.map((it) => (
            <a
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5 hover:text-white"
            >
              {it.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
