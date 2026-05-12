import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export function CallSection() {
  const t = useTranslations('call');
  return (
    <section className="bg-white px-6 py-16">
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
        <a
          href="#participate"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-navy-800"
        >
          {t('cta')}
          <Heart size={16} className="fill-cyan-400 text-cyan-400" />
        </a>
      </div>
    </section>
  );
}
