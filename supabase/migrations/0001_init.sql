-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists pgcrypto;
create extension if not exists vector;

-- ============================================================
-- MVP: curation/override layer on top of live GitHub data.
-- Keyed by GitHub repo name. GitHub is the source of truth for
-- project existence; this table only supplements it.
-- ============================================================
create table public.project_overrides (
  id                  uuid primary key default gen_random_uuid(),
  repo_name           text not null unique,
  custom_title        text,
  custom_description  text,
  custom_tags         text[] not null default '{}',
  category            text,
  featured            boolean not null default false,
  hardware_asset_url  text,
  canvas_position     jsonb,
  hidden              boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index project_overrides_repo_name_idx on public.project_overrides (repo_name);

-- ============================================================
-- Future phase stubs (empty, unused by MVP code) — created now
-- so later phases are additive, not a schema rework.
-- ============================================================

-- Phase: RAG AI assistant chat transcripts
create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null,
  role        text not null check (role in ('user', 'assistant', 'system')),
  content     text not null,
  embedding   vector(1536),
  created_at  timestamptz not null default now()
);

-- Phase: session "ghost replay" analytics
create table public.session_events (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null,
  event_type   text not null,
  payload      jsonb not null default '{}',
  occurred_at  timestamptz not null default now()
);

-- Phase: dynamic resume compiler variants
create table public.resume_variants (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  target_role  text,
  content      jsonb not null default '{}',
  pdf_url      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.project_overrides enable row level security;
alter table public.chat_messages     enable row level security;
alter table public.session_events    enable row level security;
alter table public.resume_variants   enable row level security;

-- MVP: public (anon key) can read overrides; writes are service_role only
-- (no admin UI yet — edit via the Supabase table editor or SQL directly).
create policy "public can read project overrides"
  on public.project_overrides for select
  using (true);

-- No policies on chat_messages / session_events / resume_variants yet.
-- RLS enabled + zero policies = fully locked down (service_role only),
-- the correct default until those phases define real access rules.

-- ============================================================
-- updated_at maintenance
-- ============================================================
create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger project_overrides_set_updated_at
  before update on public.project_overrides
  for each row execute function public.set_updated_at();

create trigger resume_variants_set_updated_at
  before update on public.resume_variants
  for each row execute function public.set_updated_at();
