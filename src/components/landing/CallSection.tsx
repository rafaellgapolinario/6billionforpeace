import { useTranslations } from 'next-intl';
import { HeartButton } from '@/components/HeartButton';

export function CallSection() {
  const t = useTranslations('call');
  return (
    <section className="bg-white px-6 pt-6 pb-16">
      <div
        className="mx-auto max-w-4xl rounded-3xl px-8 py-14 text-center text-white sm:px-14 sm:py-20"
        style={{
          background:
            'linear-gradient(135deg, #00BFFF 0%, #1E90FF 50%, #0F3057 100%)',
        }}
      >
        <div className="space-y-5 text-balance text-lg leading-relaxed sm:text-xl">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p className="text-2xl font-semibold sm:text-3xl">{t('p3')}</p>
        </div>
        <div className="mt-10">
          <HeartButton href="#sign">{t('cta')}</HeartButton>
        </div>
      </div>
    </section>
  );
}
