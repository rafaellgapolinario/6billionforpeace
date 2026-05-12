'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Heart } from 'lucide-react';
import { listCountries } from '@/lib/countries';

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

export function SignatureForm({ initialCountry }: { initialCountry?: string }) {
  const t = useTranslations('form');
  const locale = useLocale();
  const countries = useMemo(() => listCountries(locale), [locale]);

  const schema = z.object({
    name: z.string().trim().min(2, t('errorRequired')).max(120),
    email: z.string().email(t('errorEmail')),
    country: z.string().length(2, t('errorRequired')),
    city: z.string().trim().max(120).optional().or(z.literal('')),
    consent: z.boolean().refine((v) => v === true, { message: t('errorRequired') }),
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
      city: '',
      consent: false,
    },
  });

  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json?.error === 'duplicate') toast.success(t('errorDuplicate'));
        else if (json?.error === 'captcha') toast.error(t('errorCaptcha'));
        else if (json?.error === 'rate_limit')
          toast.error(t('errorGeneric'));
        else toast.error(t('errorGeneric'));
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
    return (
      <div className="rounded-3xl border border-cyan-200 bg-cyan-50 px-8 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-white">
          <Heart className="h-6 w-6 fill-white" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold text-navy-900">
          {t('successTitle')}
        </h3>
        <p className="mt-2 text-base text-navy-700">{t('successBody')}</p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 text-sm font-medium text-cyan-700 underline-offset-4 hover:underline"
        >
          ↺
        </button>
      </div>
    );
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
            autoComplete="name"
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

        <Field label={t('city')} error={errors.city?.message}>
          <input
            type="text"
            autoComplete="address-level2"
            placeholder={t('cityPlaceholder')}
            {...register('city')}
            className={inputCls}
          />
        </Field>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-navy-800">
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

      <div ref={containerRef} className="mt-5 flex justify-center" />

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
