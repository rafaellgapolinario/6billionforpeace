'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { locales } from '@/i18n/locales';
import { listCountries } from '@/lib/countries';

type Row = {
  id: string;
  name: string;
  email: string;
  country: string;
  city: string | null;
  locale: string;
  ip_country: string | null;
  consent_at: string;
  created_at: string;
};

type Page = { rows: Row[]; page: number; pageSize: number; total: number };

const PAGE_SIZE = 25;

export function SignaturesPanel() {
  const [country, setCountry] = useState('');
  const [locale, setLocale] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const [data, setData] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countries = useMemo(() => listCountries('en'), []);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (country) p.set('country', country);
    if (locale) p.set('locale', locale);
    if (from) p.set('from', from);
    if (to) p.set('to', to);
    if (q) p.set('q', q);
    p.set('page', String(page));
    p.set('pageSize', String(PAGE_SIZE));
    return p;
  }, [country, locale, from, to, q, page]);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/signatures?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        setError(`Request failed: ${res.status}`);
        setData(null);
        return;
      }
      const json = (await res.json()) as Page;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  function resetFilters() {
    setCountry('');
    setLocale('');
    setFrom('');
    setTo('');
    setQ('');
    setPage(1);
  }

  function exportCsv() {
    const exportParams = new URLSearchParams(params);
    exportParams.delete('page');
    exportParams.delete('pageSize');
    window.location.href = `/api/admin/signatures/export?${exportParams.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <FilterField label="Country">
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              <option value="">All</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.label}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Locale">
            <select
              value={locale}
              onChange={(e) => {
                setLocale(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              <option value="">All</option>
              {locales.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="From">
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            />
          </FilterField>
          <FilterField label="To">
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            />
          </FilterField>
          <FilterField label="Search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="name, email, city"
                className={`${selectCls} pl-9`}
              />
            </div>
          </FilterField>
          <div className="flex items-end gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 rounded-xl border border-navy-200 px-3 py-3 text-xs font-medium text-navy-700 hover:border-navy-400"
            >
              Reset
            </button>
            <button
              onClick={fetchPage}
              className="rounded-xl border border-navy-200 p-3 text-navy-700 hover:border-navy-400"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-navy-600">
          {data ? (
            <>
              <span className="font-semibold text-navy-900">
                {data.total.toLocaleString()}
              </span>{' '}
              signature{data.total === 1 ? '' : 's'}
              {loading && <span className="ml-2 text-navy-400">refreshing…</span>}
            </>
          ) : loading ? (
            'Loading…'
          ) : (
            ''
          )}
        </p>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-navy-50 text-xs uppercase tracking-wide text-navy-600">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Country</Th>
              <Th>City</Th>
              <Th>Locale</Th>
              <Th>IP country</Th>
              <Th>Signed</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {data?.rows.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-navy-400">
                  No signatures match these filters yet.
                </td>
              </tr>
            )}
            {data?.rows.map((r) => (
              <tr key={r.id} className="hover:bg-cyan-50/40">
                <Td className="font-medium text-navy-900">{r.name}</Td>
                <Td className="text-navy-700">{r.email}</Td>
                <Td>{r.country}</Td>
                <Td>{r.city ?? '—'}</Td>
                <Td>{r.locale.toUpperCase()}</Td>
                <Td>{r.ip_country ?? '—'}</Td>
                <Td className="text-navy-500">
                  {new Date(r.created_at).toLocaleString()}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className="rounded-full border border-navy-200 px-4 py-2 text-xs font-medium text-navy-700 disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-xs text-navy-500">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
          className="rounded-full border border-navy-200 px-4 py-2 text-xs font-medium text-navy-700 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const selectCls =
  'w-full rounded-xl border border-navy-200 bg-white px-3 py-3 text-sm text-navy-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30';

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-navy-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
