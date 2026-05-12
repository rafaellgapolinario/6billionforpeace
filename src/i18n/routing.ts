import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './locales';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // / → defaultLocale; /pt, /es, … pra outros
});
