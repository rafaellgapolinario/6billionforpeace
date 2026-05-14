'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/Logo';
import { LanguagePicker } from '@/components/LanguagePicker';

export function Header() {
  const tHeader = useTranslations('header');
  const tFooter = useTranslations('footer');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: '/',                  label: tFooter('home') },
    { href: '/participation',     label: tFooter('participate') },
    { href: '/transparency',      label: tFooter('transparency') },
    { href: '/donations',         label: tFooter('donations') },
    { href: '/peace-wall',        label: tFooter('peaceWall') },
    { href: '/peace-declaration', label: tFooter('declaration') },
  ];

  // Fecha o popover ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-navy-900">
      <div className="relative mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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

        <div ref={menuRef} className="relative z-10 flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? tHeader('menuClose') : tHeader('menuOpen')}
            aria-haspopup="menu"
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white transition-colors hover:bg-white/5"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {open && (
            <nav
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-navy-900 py-1 shadow-2xl shadow-black/40"
            >
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/5 hover:text-white"
                >
                  {it.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
