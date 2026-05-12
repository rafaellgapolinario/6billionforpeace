# 6billionforpeace

A voluntary, independent global movement for world peace.
Landing page that collects signatures and visualizes voices around the world in real time.

> _"It is time to unite 6 billion voices with a single goal: peace in the world."_

## Stack

- **Next.js 16** + TypeScript + Tailwind v4 (App Router)
- **next-intl** — 8 languages with manual translations: `en · pt · es · fr · de · it · zh · ar`
  (Arabic ships with full RTL layout)
- **Supabase** — Postgres + Realtime + Auth (`signatures`, `stats` singleton, `admin_users`, RLS)
- **MapLibre GL JS** (D2) — open-source world map, no quota
- **Cloudflare Turnstile** (D2) — invisible anti-bot challenge
- **Vercel** — edge headers (`x-vercel-ip-country` for auto-detected country)

## Privacy posture (LGPD / GDPR)

- Explicit consent checkbox before submission (`consent_at` stored)
- Raw IP is **never persisted**. Only `sha256(ip + salt)` is stored, exclusively for
  duplicate-vote prevention. Reversing the hash to recover the IP is not feasible.
- No third-party trackers. No marketing cookies.

## Local development

```bash
cp .env.example .env.local   # then fill SUPABASE_SERVICE_ROLE_KEY and (later) Turnstile keys
npm install
npm run dev                  # http://localhost:3000
```

## Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx     # html lang/dir, fonts (Allura/Inter/Noto)
│   │   └── page.tsx       # landing composition
│   └── api/sign/route.ts  # signature insert + Turnstile + geo + ip_hash
├── components/
│   ├── Logo.tsx
│   ├── LanguagePicker.tsx
│   └── landing/           # Header, HeroHeart, Solution, Call, Principles,
│                          # Volunteers, Everest, SignatureForm, LiveCounter,
│                          # WorldMapPlaceholder, Footer, CookieBanner
├── i18n/                  # routing, navigation, request, locales
├── lib/
│   ├── supabase/          # browser / server / admin clients
│   ├── countries.ts       # ISO 3166-1 + Intl.DisplayNames
│   └── utils.ts
├── middleware.ts          # next-intl locale routing
messages/                  # en, pt, es, fr, de, it, zh, ar
```

## Schema

| Table          | Purpose                                                          |
| -------------- | ---------------------------------------------------------------- |
| `signatures`   | One row per signer. Unique email. `ip_hash` for de-dup, not PII. |
| `stats`        | Singleton (`id=1`). Incremented by trigger. Realtime broadcast.  |
| `admin_users`  | Authorized accounts for the admin panel (D3).                    |

## Roadmap

- **D1 — today** Schema + i18n + landing skeleton + sign API + LGPD banner ✅
- **D2 — 13/05** MapLibre integration, real-time counter wiring, Turnstile widget, RTL polish
- **D3 — 14/05** Admin panel (Supabase Auth + filters + CSV export), deploy, smoke tests
