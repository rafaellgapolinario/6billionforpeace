'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { formatNumber } from '@/lib/utils';

type Stats = {
  total_signatures: number;
  by_country: Record<string, number>;
  updated_at: string;
};

export function LiveCounter({ initialStats }: { initialStats?: Stats }) {
  const t = useTranslations('counter');
  const locale = useLocale();
  const [stats, setStats] = useState<Stats | null>(initialStats ?? null);
  const [bump, setBump] = useState(false);
  const lastTotal = useRef<number | null>(initialStats?.total_signatures ?? null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    let cancelled = false;
    (async () => {
      if (!stats) {
        const { data } = await supabase
          .from('stats')
          .select('total_signatures, by_country, updated_at')
          .eq('id', 1)
          .single();
        if (!cancelled && data) {
          setStats(data as Stats);
          lastTotal.current = data.total_signatures;
        }
      }
    })();

    const channel = supabase
      .channel('stats-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'bfp', table: 'stats', filter: 'id=eq.1' },
        (payload) => {
          const next = payload.new as Stats;
          setStats(next);
          if (lastTotal.current !== null && next.total_signatures > lastTotal.current) {
            setBump(true);
            setTimeout(() => setBump(false), 500);
          }
          lastTotal.current = next.total_signatures;
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) {
    return (
      <p className="text-center text-sm text-navy-500">{t('loading')}</p>
    );
  }

  const total = stats.total_signatures;
  const countries = Object.keys(stats.by_country ?? {}).length;

  return (
    <div className="text-center">
      <div
        className={`font-script text-6xl text-cyan-500 sm:text-7xl ${bump ? 'count-bump' : ''}`}
      >
        {formatNumber(total, locale)}
      </div>
      <div className="mt-1 text-lg font-medium text-navy-700 sm:text-xl">
        {t('label')}
      </div>
      <div className="mt-3 text-lg font-semibold text-navy-900 sm:text-xl">
        {t('countries', { count: countries })}
      </div>
    </div>
  );
}
