import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const localeParam = url.searchParams.get('locale');
  const locale =
    localeParam && /^[a-z]{2}$/.test(localeParam) ? localeParam : 'en';

  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  const okUrl = new URL(`${localePrefix}/confirmado?ok=1`, url.origin);
  const failUrl = new URL(`${localePrefix}/confirmado?ok=0`, url.origin);

  if (!token || !/^[a-f0-9]{32,128}$/i.test(token)) {
    return NextResponse.redirect(failUrl, 302);
  }

  const supabase = createSupabaseAdminClient();
  // Look up the row, then atomically mark it confirmed and clear the token.
  const { data: row, error: fetchErr } = await supabase
    .from('signatures')
    .select('id, confirmed_at, locale')
    .eq('confirmation_token', token)
    .maybeSingle();

  if (fetchErr || !row) {
    return NextResponse.redirect(failUrl, 302);
  }

  if (row.confirmed_at) {
    // already confirmed — still send the user to the success page
    const redirectLocale = row.locale ?? locale;
    const lp = redirectLocale === 'en' ? '' : `/${redirectLocale}`;
    return NextResponse.redirect(new URL(`${lp}/confirmado?ok=1`, url.origin), 302);
  }

  const { error: updErr } = await supabase
    .from('signatures')
    .update({
      confirmed_at: new Date().toISOString(),
      confirmation_token: null,
    })
    .eq('id', row.id);

  if (updErr) {
    console.error('[confirm] update error', updErr);
    return NextResponse.redirect(failUrl, 302);
  }

  const redirectLocale = row.locale ?? locale;
  const lp = redirectLocale === 'en' ? '' : `/${redirectLocale}`;
  return NextResponse.redirect(new URL(`${lp}/confirmado?ok=1`, url.origin), 302);
}
