import { useTranslations } from 'next-intl';
import { HeartButton } from '@/components/HeartButton';

export function SolutionSection() {
  const t = useTranslations('solution');
  const paragraphs = [t('p1'), t('p2'), t('p3'), t('p4')].filter(Boolean);

  return (
    <section id="solution" className="bg-white pt-20 pb-10 sm:pt-24 sm:pb-12">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-cyan-600 sm:text-3xl">
          {t('title')}
        </h2>
        <div className="mt-8 space-y-5 text-balance text-lg leading-relaxed text-navy-800 sm:text-xl">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-12">
          <HeartButton href="#sign">{t('cta')}</HeartButton>
        </div>
      </div>
    </section>
  );
}
