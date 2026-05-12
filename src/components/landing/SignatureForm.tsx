'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Heart, Share2, Copy, Check } from 'lucide-react';

type CountryOption = { code: string; label: string };

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement | string,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          'timeout-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible' | 'invisible';
          appearance?: 'always' | 'execute' | 'interaction-only';
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export function SignatureForm({
  initialCountry,
  countries,
}: {
  initialCountry?: string;
  countries: CountryOption[];
}) {
  const t = useTranslations('form');
  const locale = useLocale();

  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(2, t('errorRequired'))
      .max(120)
      .refine((v) => !/\d{6,}/.test(v), { message: t('errorNoDigits') }),
    email: z.string().email(t('errorEmail')),
    country: z.string().length(2, t('errorRequired')),
    supportsTreaty: z.boolean().refine((v) => v === true, { message: t('supportTreatyRequired') }),
    consent: z.boolean().refine((v) => v === true, { message: t('errorRequired') }),
    website: z.string().optional(), // honeypot
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      country: initialCountry ?? '',
      supportsTreaty: false,
      consent: false,
      website: '',
    },
  });

  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const formStartedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (initialCountry) setValue('country', initialCountry);
  }, [initialCountry, setValue]);

  useEffect(() => {
    if (!SITE_KEY) return;

    const mount = () => {
      if (
        !window.turnstile ||
        !containerRef.current ||
        widgetIdRef.current
      )
        return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        theme: 'light',
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
        'timeout-callback': () => setTurnstileToken(null),
        'error-callback': () => setTurnstileToken(null),
      });
    };

    if (window.turnstile) {
      mount();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(
      `script[src^="${TURNSTILE_SCRIPT_SRC}"]`,
    );
    if (!script) {
      script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', mount);
    return () => {
      script?.removeEventListener('load', mount);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale,
          turnstileToken: turnstileToken ?? undefined,
          formStartedAt: formStartedAtRef.current,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json?.error === 'duplicate') toast.warning(t('errorDuplicate'));
        else if (json?.error === 'captcha') toast.warning(t('errorCaptcha'));
        else if (json?.error === 'rate_limit') toast.warning(t('errorRateLimit'));
        else if (json?.error === 'too_fast') toast.warning(t('errorTooFast'));
        else if (json?.error === 'disposable_email') toast.warning(t('errorDisposable'));
        else toast.error(t('errorGeneric'));
        // Turnstile tokens são one-time — reseta o widget pra próxima tentativa
        setTurnstileToken(null);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        return;
      }
      setDone(true);
      reset();
      setTurnstileToken(null);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
      toast.success(t('successTitle'), { description: t('successBody') });
    } catch {
      toast.error(t('errorGeneric'));
    }
  };

  if (done) {
    return <SuccessCard t={t} onReset={() => setDone(false)} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-navy-100 bg-white p-6 shadow-xl shadow-navy-900/[.06] sm:p-10"
    >
      <h3 className="text-2xl font-semibold text-navy-900 sm:text-3xl">
        {t('title')}
      </h3>
      <p className="mt-2 text-sm text-muted">{t('subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label={t('name')} error={errors.name?.message}>
          <input
            type="text"
            autoComplete="given-name additional-name family-name"
            data-lpignore="true"
            placeholder={t('namePlaceholder')}
            {...register('name')}
            className={inputCls}
          />
        </Field>

        <Field label={t('email')} error={errors.email?.message}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            {...register('email')}
            className={inputCls}
          />
        </Field>

        <Field label={t('country')} error={errors.country?.message}>
          <select {...register('country')} className={inputCls}>
            <option value="">{t('countryPlaceholder')}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 space-y-3">
        <label className="flex items-start gap-3 text-sm font-medium text-navy-900">
          <input
            type="checkbox"
            {...register('supportsTreaty')}
            className="mt-0.5 h-4 w-4 rounded border-navy-300 text-cyan-600 accent-cyan-600"
          />
          <span>
            {t('supportTreaty')}
            {errors.supportsTreaty?.message && (
              <span className="ml-2 text-red-600">— {errors.supportsTreaty.message}</span>
            )}
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-navy-800">
          <input
            type="checkbox"
            {...register('consent')}
            className="mt-0.5 h-4 w-4 rounded border-navy-300 text-cyan-600 accent-cyan-600"
          />
          <span>
            {t('consent')}
            {errors.consent?.message && (
              <span className="ml-2 text-red-600">— {errors.consent.message}</span>
            )}
          </span>
        </label>
      </div>

      <div ref={containerRef} className="mt-5 flex justify-center" />

      {/* Honeypot: hidden from humans, bots tend to autofill any input */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-4 text-base font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-navy-800 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          <>
            <Heart className="h-4 w-4 fill-cyan-400 text-cyan-400" />
            {t('submit')}
          </>
        )}
      </button>
    </form>
  );
}

function SuccessCard({
  t,
  onReset,
}: {
  t: ReturnType<typeof useTranslations<'form'>>;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.origin + '/'
      : 'https://6billionforpeace.vercel.app/';

  async function handleShare() {
    const text = t('shareText');
    const title = t('shareTitle');
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // user cancelled, fall through to copy
      }
    }
    await handleCopy();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${t('shareText')} ${shareUrl}`);
      setCopied(true);
      toast.success(t('copyDone'));
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error(t('errorGeneric'));
    }
  }

  return (
    <div className="rounded-3xl border border-cyan-200 bg-cyan-50 px-8 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-white">
        <Heart className="h-6 w-6 fill-white" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-navy-900">
        {t('successTitle')}
      </h3>
      <p className="mt-2 text-base text-navy-700">{t('successBody')}</p>

      <div className="mt-7 rounded-2xl border border-cyan-200 bg-white p-5">
        <p className="text-sm font-semibold text-navy-900">{t('shareTitle')}</p>
        <p className="mt-1 text-xs text-navy-600">{t('shareBody')}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <Share2 className="h-4 w-4" />
            {t('shareCta')}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-medium text-navy-800 hover:border-navy-300"
          >
            {copied ? <Check className="h-4 w-4 text-cyan-600" /> : <Copy className="h-4 w-4" />}
            {copied ? t('copyDone') : t('copyCta')}
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-6 text-xs font-medium text-cyan-700 underline-offset-4 hover:underline"
      >
        ↺
      </button>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-300 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-navy-700">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
