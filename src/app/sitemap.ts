import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/locales';

const PUBLIC_PATHS = ['', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://6billionforpeace.net';
  const out: MetadataRoute.Sitemap = [];
  for (const path of PUBLIC_PATHS) {
    for (const locale of locales) {
      out.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.5,
      });
    }
  }
  return out;
}
