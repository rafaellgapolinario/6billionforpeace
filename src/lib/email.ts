import 'server-only';

type EmailMessages = {
  subject: string;
  heading: string;
  body: string;
  cta: string;
  footer: string;
};

const SUPPORTED_LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'zh', 'ar'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(v: string): v is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(v);
}

async function loadMessages(locale: string): Promise<EmailMessages> {
  const safe: SupportedLocale = isLocale(locale) ? locale : 'en';
  const msgs = (await import(`@/../messages/${safe}.json`)) as { default: { email: EmailMessages } };
  return msgs.default.email;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml(opts: {
  m: EmailMessages;
  name: string;
  url: string;
  dir: 'ltr' | 'rtl';
}): string {
  const bodyHtml = opts.m.body
    .replace('{name}', escapeHtml(opts.name))
    .split('\n\n')
    .map((p) => `<p style="margin:0 0 16px;line-height:1.55">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
  return `<!doctype html>
<html dir="${opts.dir}">
  <body style="margin:0;padding:0;background:#F4F8FB;font-family:-apple-system,Segoe UI,Roboto,Inter,sans-serif;color:#0A2540">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px">
      <div style="background:#fff;border:1px solid #C9D6E5;border-radius:20px;padding:36px 32px">
        <h1 style="margin:0 0 20px;font-size:24px;color:#0A2540">${escapeHtml(opts.m.heading)}</h1>
        ${bodyHtml}
        <p style="margin:28px 0 0">
          <a href="${opts.url}" style="display:inline-block;background:#0A2540;color:#fff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:9999px">${escapeHtml(opts.m.cta)}</a>
        </p>
      </div>
      <p style="margin:20px 0 0;text-align:center;color:#5A6B7E;font-size:12px">${escapeHtml(opts.m.footer)}</p>
    </div>
  </body>
</html>`;
}

function renderText(opts: { m: EmailMessages; name: string; url: string }): string {
  return [
    opts.m.heading,
    '',
    opts.m.body.replace('{name}', opts.name),
    '',
    opts.m.cta + ': ' + opts.url,
    '',
    '— ' + opts.m.footer,
  ].join('\n');
}

async function send(params: {
  to: string;
  name: string;
  locale: string;
  url: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? 'onboarding@resend.dev';
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY missing — skipping send', { to: params.to });
    return false;
  }
  const m = await loadMessages(params.locale);
  const dir = params.locale === 'ar' ? 'rtl' : 'ltr';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: m.subject,
      html: renderHtml({ m, name: params.name, url: params.url, dir }),
      text: renderText({ m, name: params.name, url: params.url }),
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.error('[email] resend non-ok', res.status, txt.slice(0, 240));
    return false;
  }
  return true;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://6billionforpeace.vercel.app';

/**
 * Single opt-in thank-you. Sent right after a signature is confirmed, as a
 * notification — does not gate anything. The CTA points back to the site
 * (share-the-movement use case), not to a confirmation endpoint.
 */
export async function sendThankYouEmail(params: {
  to: string;
  name: string;
  locale: string;
}): Promise<boolean> {
  return send({ ...params, url: SITE_URL });
}
