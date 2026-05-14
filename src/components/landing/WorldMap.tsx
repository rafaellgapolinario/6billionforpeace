'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import 'leaflet/dist/leaflet.css';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getCountryCentroid } from '@/lib/country-centroids';

type Stats = {
  total_signatures: number;
  by_country: Record<string, number>;
  updated_at: string;
};

type LeafletMap = {
  remove: () => void;
};
type LayerGroup = {
  clearLayers: () => void;
  addLayer: (l: unknown) => unknown;
};

function radiusFor(count: number) {
  return Math.min(17, (10 + count * 2) / 2);
}

export function WorldMap({ initialStats }: { initialStats?: Stats }) {
  const t = useTranslations('map');
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);
  const lastByCountry = useRef<Record<string, number>>(
    initialStats?.by_country ?? {},
  );
  const [ready, setReady] = useState(false);

  function drawMarkers(byCountry: Record<string, number>) {
    const L = leafletRef.current;
    const group = markersRef.current;
    if (!L || !group) return;
    group.clearLayers();
    for (const [code, count] of Object.entries(byCountry)) {
      const centroid = getCountryCentroid(code);
      if (!centroid) continue;
      const [lng, lat] = centroid;
      const marker = L.circleMarker([lat, lng], {
        radius: radiusFor(count),
        weight: 2,
        fillOpacity: 0.72,
      }).bindPopup(
        `<strong>${code}</strong><br>${count} ${count === 1 ? t('signature') : t('signatures')}`,
      );
      group.addLayer(marker);
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;
      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      }).setView([18, 0], 2);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const group = L.layerGroup().addTo(map);
      mapRef.current = map as unknown as LeafletMap;
      markersRef.current = group as unknown as LayerGroup;

      drawMarkers(lastByCountry.current);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
      leafletRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel('map-stats-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'bfp', table: 'stats', filter: 'id=eq.1' },
        (payload) => {
          const next = payload.new as Stats;
          const nextBC = next.by_country ?? {};
          lastByCountry.current = nextBC;
          drawMarkers(nextBC);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">
          {t('title')}
        </h2>
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-navy-100 bg-gray-100">
          <div
            ref={containerRef}
            className="aspect-[16/9] w-full"
            aria-label={t('title')}
          />
          {!ready && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-navy-500">
              {t('loading')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
