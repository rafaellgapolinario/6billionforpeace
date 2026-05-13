export const locales = ['en', 'pt', 'es', 'fr', 'ru', 'hi', 'zh', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<
  Locale,
  { label: string; native: string; dir: 'ltr' | 'rtl'; flag: string }
> = {
  en: { label: 'English',    native: 'English',  dir: 'ltr', flag: '🇺🇸' },
  pt: { label: 'Portuguese', native: 'Português', dir: 'ltr', flag: '🇧🇷' },
  es: { label: 'Spanish',    native: 'Español',  dir: 'ltr', flag: '🇪🇸' },
  fr: { label: 'French',     native: 'Français', dir: 'ltr', flag: '🇫🇷' },
  ru: { label: 'Russian',    native: 'Русский',  dir: 'ltr', flag: '🇷🇺' },
  hi: { label: 'Hindi',      native: 'हिन्दी',     dir: 'ltr', flag: '🇮🇳' },
  zh: { label: 'Chinese',    native: '中文',      dir: 'ltr', flag: '🇨🇳' },
  ar: { label: 'Arabic',     native: 'العربية',  dir: 'rtl', flag: '🇸🇦' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
