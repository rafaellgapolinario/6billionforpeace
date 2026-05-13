import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';

export function HumansForPeaceSection() {
  const t = useTranslations('humansForPeace');
  return (
    <section className="bg-surface px-6 py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 flex items-center justify-center rounded-full bg-cyan-500/10 p-4">
          <Users className="h-8 w-8 text-cyan-600" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-navy-700 sm:text-lg">
          {t('body')}
        </p>
      </div>
    </section>
  );
}
