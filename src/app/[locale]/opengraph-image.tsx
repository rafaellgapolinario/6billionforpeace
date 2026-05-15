import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export const alt = '6billionforpeace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = hasLocale(routing.locales, params.locale) ? params.locale : 'en';
  const t = await getTranslations({ locale, namespace: 'meta' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at center, #0F3B6E 0%, #0A2540 60%, #061a30 100%)',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        <svg
          width="260"
          height="260"
          viewBox="0 0 24 24"
          style={{ filter: 'drop-shadow(0 0 40px rgba(0, 191, 255, 0.55))' }}
        >
          <path
            d="M12 20.4s-7-4.3-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 3.9c0 6.2-7 10.5-7 10.5z"
            fill="#00BFFF"
          />
        </svg>

        <div
          style={{
            color: '#FFFFFF',
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginTop: 48,
            display: 'flex',
          }}
        >
          6billionforpeace
        </div>

        <div
          style={{
            color: '#7FD4FF',
            fontSize: 34,
            fontWeight: 400,
            marginTop: 24,
            textAlign: 'center',
            maxWidth: 900,
            display: 'flex',
          }}
        >
          {t('title').includes('—') ? t('title').split('—')[1].trim() : t('title')}
        </div>
      </div>
    ),
    { ...size }
  );
}
