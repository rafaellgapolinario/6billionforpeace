import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_PAGE_SIZE = 100;

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 60 requests/min por admin — abre dashboard, pagina, filtra à vontade,
  // mas scraping em loop é cortado.
  const rl = checkRateLimit(`admin:list:${session.userId}`, 60, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }

  const url = new URL(req.url);
  const country = url.searchParams.get('country')?.toUpperCase() || null;
  const locale = url.searchParams.get('locale')?.toLowerCase() || null;
  const from = url.searchParams.get('from'); // ISO date YYYY-MM-DD
  const to = url.searchParams.get('to');
  const q = url.searchParams.get('q')?.trim() || null;
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(10, Number(url.searchParams.get('pageSize') ?? 25)),
  );

  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from('signatures')
    .select('id, name, email, country, city, locale, ip_country, consent_at, created_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false });

  if (country) query = query.eq('country', country);
  if (locale) query = query.eq('locale', locale);
  if (from) query = query.gte('created_at', `${from}T00:00:00Z`);
  if (to) query = query.lte('created_at', `${to}T23:59:59Z`);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,city.ilike.%${q}%`);

  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error('[admin/signatures] query error', error);
    return NextResponse.json({ error: 'query_failed' }, { status: 500 });
  }

  return NextResponse.json({
    rows: data ?? [],
    page,
    pageSize,
    total: count ?? 0,
  });
}
