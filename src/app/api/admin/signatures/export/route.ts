import { getAdminSession } from '@/lib/admin/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXPORT_CAP = 100_000;
const CHUNK = 1_000;

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return new Response('unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const country = url.searchParams.get('country')?.toUpperCase() || null;
  const locale = url.searchParams.get('locale')?.toLowerCase() || null;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const q = url.searchParams.get('q')?.trim() || null;

  const supabase = createSupabaseAdminClient();

  const header =
    'id,name,email,country,city,locale,ip_country,consent_at,created_at\n';

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      // UTF-8 BOM so Excel/Numbers auto-detect encoding instead of latin-1
      controller.enqueue(enc.encode('﻿'));
      controller.enqueue(enc.encode(header));

      let offset = 0;
      while (offset < EXPORT_CAP) {
        let query = supabase
          .from('signatures')
          .select(
            'id, name, email, country, city, locale, ip_country, consent_at, created_at',
          )
          .order('created_at', { ascending: false })
          .range(offset, offset + CHUNK - 1);
        if (country) query = query.eq('country', country);
        if (locale) query = query.eq('locale', locale);
        if (from) query = query.gte('created_at', `${from}T00:00:00Z`);
        if (to) query = query.lte('created_at', `${to}T23:59:59Z`);
        if (q)
          query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,city.ilike.%${q}%`);

        const { data, error } = await query;
        if (error) {
          controller.error(error);
          return;
        }
        if (!data || data.length === 0) break;

        for (const row of data) {
          const line = [
            row.id,
            row.name,
            row.email,
            row.country,
            row.city,
            row.locale,
            row.ip_country,
            row.consent_at,
            row.created_at,
          ]
            .map(csvCell)
            .join(',');
          controller.enqueue(enc.encode(line + '\n'));
        }

        if (data.length < CHUNK) break;
        offset += CHUNK;
      }
      controller.close();
    },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(stream, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="signatures-${stamp}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
