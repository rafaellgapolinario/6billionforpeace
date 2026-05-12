'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import maplibregl, {
  type Map as MlMap,
  type GeoJSONSource,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getCountryCentroid } from '@/lib/country-centroids';

type Stats = {
  total_signatures: number;
  by_country: Record<string, number>;
  updated_at: string;
};

type PointFeature = {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: { code: string; count: number };
};

type PointFC = { type: 'FeatureCollection'; features: PointFeature[] };

function byCountryToFC(byCountry: Record<string, number>): PointFC {
  const features: PointFeature[] = [];
  for (const [code, count] of Object.entries(byCountry)) {
    const centroid = getCountryCentroid(code);
    if (!centroid) continue;
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: centroid },
      properties: { code, count },
    });
  }
  return { type: 'FeatureCollection', features };
}

function pulsePin(map: MlMap, lngLat: [number, number]) {
  const el = document.createElement('div');
  el.className = 'pin-pulse';
  el.style.cssText =
    'width:14px;height:14px;border-radius:9999px;background:#00BFFF;border:2px solid #fff;box-shadow:0 0 0 0 rgba(0,191,255,.55);';
  const marker = new maplibregl.Marker({ element: el })
    .setLngLat(lngLat)
    .addTo(map);
  setTimeout(() => marker.remove(), 3800);
}

export function WorldMap({ initialStats }: { initialStats?: Stats }) {
  const t = useTranslations('map');
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const lastByCountry = useRef<Record<string, number>>(
    initialStats?.by_country ?? {},
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const styleUrl =
      process.env.NEXT_PUBLIC_MAPLIBRE_STYLE ??
      'https://demotiles.maplibre.org/style.json';

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [10, 20],
      zoom: 1.1,
      minZoom: 0.6,
      maxZoom: 6,
      attributionControl: false,
    });
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right',
    );
    mapRef.current = map;

    map.on('load', () => {
      map.addSource('signatures', {
        type: 'geojson',
        data: byCountryToFC(lastByCountry.current) as never,
      });
      map.addLayer({
        id: 'signatures-glow',
        type: 'circle',
        source: 'signatures',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            1, 10,
            10, 16,
            100, 24,
            1000, 32,
            10000, 42,
          ],
          'circle-color': '#00BFFF',
          'circle-opacity': 0.18,
          'circle-blur': 0.6,
        },
      });
      map.addLayer({
        id: 'signatures-core',
        type: 'circle',
        source: 'signatures',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            1, 4,
            10, 5,
            100, 6,
            1000, 8,
            10000, 10,
          ],
          'circle-color': '#00BFFF',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1,
          'circle-opacity': 0.95,
        },
      });
      setReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
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
          const prev = lastByCountry.current;
          const nextBC = next.by_country ?? {};

          let pulseCountry: string | null = null;
          for (const code of Object.keys(nextBC)) {
            if ((nextBC[code] ?? 0) > (prev[code] ?? 0)) {
              pulseCountry = code;
              break;
            }
          }
          lastByCountry.current = nextBC;

          const src = mapRef.current?.getSource('signatures') as
            | GeoJSONSource
            | undefined;
          src?.setData(byCountryToFC(nextBC) as never);

          if (pulseCountry && mapRef.current) {
            const centroid = getCountryCentroid(pulseCountry);
            if (centroid) pulsePin(mapRef.current, centroid);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">
          {t('title')}
        </h2>
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-navy-100 bg-navy-900">
          <div
            ref={containerRef}
            className="aspect-[16/9] w-full"
            aria-label={t('title')}
          />
          {!ready && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/40">
              {t('loading')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
