-- 6billionforpeace.net — schema `bfp` (idempotente)
-- Aplica em projeto Supabase Cloud virgem. Roda no SQL Editor do painel.

create extension if not exists citext;

create schema if not exists bfp;

-- Triggers function -----------------------------------------------------------
create or replace function bfp.bump_signature_stats() returns trigger
  language plpgsql security definer as $$
begin
  if (TG_OP = 'INSERT' and NEW.confirmed_at is not null)
     or (TG_OP = 'UPDATE' and OLD.confirmed_at is null and NEW.confirmed_at is not null) then
    update bfp.stats set
      total_signatures = total_signatures + 1,
      by_country = jsonb_set(by_country, array[NEW.country],
        to_jsonb(coalesce((by_country->>NEW.country)::bigint, 0) + 1), true),
      by_locale = jsonb_set(by_locale, array[NEW.locale],
        to_jsonb(coalesce((by_locale->>NEW.locale)::bigint, 0) + 1), true),
      updated_at = now()
    where id = 1;
  end if;
  return NEW;
end;
$$;

create or replace function bfp.is_admin() returns boolean
  language sql stable security definer set search_path = bfp, public as $$
  select exists (select 1 from bfp.admin_users where user_id = auth.uid());
$$;

-- Tables ----------------------------------------------------------------------
create table if not exists bfp.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'owner')),
  created_at timestamptz not null default now()
);

create table if not exists bfp.signatures (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email citext not null,
  country char(2) not null,
  city text check (city is null or char_length(city) <= 120),
  locale char(2) not null default 'en',
  latitude double precision,
  longitude double precision,
  ip_country char(2),
  ip_hash text,
  user_agent text,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmation_token text,
  supports_treaty boolean not null default false,
  constraint signatures_email_check check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create unique index if not exists signatures_email_uniq on bfp.signatures (email);
create unique index if not exists signatures_confirmation_token_uniq on bfp.signatures (confirmation_token) where confirmation_token is not null;
create index if not exists signatures_country_idx on bfp.signatures (country);
create index if not exists signatures_locale_idx on bfp.signatures (locale);
create index if not exists signatures_created_at_idx on bfp.signatures (created_at desc);
create index if not exists signatures_unconfirmed_idx on bfp.signatures (created_at) where confirmed_at is null;

create table if not exists bfp.stats (
  id smallint primary key default 1 check (id = 1),
  total_signatures bigint not null default 0,
  by_country jsonb not null default '{}'::jsonb,
  by_locale jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into bfp.stats (id) values (1) on conflict (id) do nothing;

-- Trigger ---------------------------------------------------------------------
drop trigger if exists bump_signature_stats_iu on bfp.signatures;
create trigger bump_signature_stats_iu
  after insert or update of confirmed_at on bfp.signatures
  for each row execute function bfp.bump_signature_stats();

-- RLS -------------------------------------------------------------------------
alter table bfp.admin_users enable row level security;
alter table bfp.signatures enable row level security;
alter table bfp.stats enable row level security;

drop policy if exists admin_self_read on bfp.admin_users;
create policy admin_self_read on bfp.admin_users for select to authenticated
  using (user_id = auth.uid() or bfp.is_admin());

drop policy if exists signatures_admin_select on bfp.signatures;
create policy signatures_admin_select on bfp.signatures for select to authenticated
  using (bfp.is_admin());

drop policy if exists signatures_admin_delete on bfp.signatures;
create policy signatures_admin_delete on bfp.signatures for delete to authenticated
  using (bfp.is_admin());

drop policy if exists stats_public_read on bfp.stats;
create policy stats_public_read on bfp.stats for select to authenticated, anon
  using (true);

-- Grants ----------------------------------------------------------------------
grant usage on schema bfp to anon, authenticated, service_role;

grant select on bfp.stats to anon, authenticated;
grant select, insert, update, delete on bfp.signatures to service_role, authenticated;
grant select, insert, update, delete on bfp.admin_users to service_role, authenticated;
grant update (total_signatures, by_country, by_locale, updated_at) on bfp.stats to service_role;

-- Realtime --------------------------------------------------------------------
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'bfp' and tablename = 'stats'
  ) then
    alter publication supabase_realtime add table bfp.stats;
  end if;
end $$;
