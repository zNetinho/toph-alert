-- Schema V1 — toph-alert
-- Internal team auth only (authenticated). No multi-tenant RLS / clientes.

-- ---------------------------------------------------------------------------
-- Enums (aligned with @toph-alert/domain)
-- ---------------------------------------------------------------------------

create type public.erro_status as enum ('novo', 'processing', 'ticket_aberto');

create type public.outbox_step as enum ('create_ticket', 'notify');

create type public.outbox_status as enum ('pending', 'processing', 'done', 'failed');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.lojas (
  id uuid primary key default gen_random_uuid(),
  store_key text not null,
  name text,
  allowed_origins text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lojas_store_key_key unique (store_key)
);

comment on table public.lojas is 'Ecommerce stores that install the browser SDK.';
comment on column public.lojas.store_key is 'Public key sent by the SDK on ingest.';
comment on column public.lojas.allowed_origins is 'Origin allowlist checked at ingest.';

create table public.erros (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas (id) on delete cascade,
  fingerprint text not null,
  message text not null,
  type text,
  stack text,
  traces jsonb,
  url text,
  status public.erro_status not null default 'novo',
  occurrence_count integer not null default 1 check (occurrence_count >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint erros_loja_fingerprint_key unique (loja_id, fingerprint)
);

comment on table public.erros is 'Deduped errors scoped by loja + fingerprint.';
create index erros_loja_id_idx on public.erros (loja_id);
create index erros_status_idx on public.erros (status);
create index erros_created_at_idx on public.erros (created_at desc);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  erro_id uuid not null references public.erros (id) on delete cascade,
  external_id text not null,
  provider text not null default 'runrunit',
  title text,
  raw jsonb,
  created_at timestamptz not null default now(),
  constraint tickets_erro_id_key unique (erro_id),
  constraint tickets_provider_external_id_key unique (provider, external_id)
);

comment on table public.tickets is 'External ticket linkage (Runrunit in V1).';
create index tickets_erro_id_idx on public.tickets (erro_id);

create table public.outbox (
  id uuid primary key default gen_random_uuid(),
  erro_id uuid not null references public.erros (id) on delete cascade,
  step public.outbox_step not null,
  status public.outbox_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  retry_count integer not null default 0 check (retry_count >= 0),
  last_error text,
  available_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.outbox is 'Async pipeline queue: create_ticket then notify.';
create index outbox_claim_idx
  on public.outbox (status, available_at, created_at)
  where status in ('pending', 'failed');
create index outbox_erro_id_idx on public.outbox (erro_id);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger lojas_set_updated_at
  before update on public.lojas
  for each row execute function public.set_updated_at();

create trigger erros_set_updated_at
  before update on public.erros
  for each row execute function public.set_updated_at();

create trigger outbox_set_updated_at
  before update on public.outbox
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Data API grants (tables are not auto-exposed by default as of 2026)
-- ---------------------------------------------------------------------------

grant usage on schema public to authenticated, service_role;

grant select, insert, update, delete on public.lojas to authenticated, service_role;
grant select, insert, update, delete on public.erros to authenticated, service_role;
grant select, insert, update, delete on public.tickets to authenticated, service_role;
grant select, insert, update, delete on public.outbox to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- RLS — internal team (any authenticated user). No anon access.
-- Ingest/worker use service_role (bypasses RLS).
-- ---------------------------------------------------------------------------

alter table public.lojas enable row level security;
alter table public.erros enable row level security;
alter table public.tickets enable row level security;
alter table public.outbox enable row level security;

create policy "internal_team_select_lojas"
  on public.lojas
  for select
  to authenticated
  using (true);

create policy "internal_team_insert_lojas"
  on public.lojas
  for insert
  to authenticated
  with check (true);

create policy "internal_team_update_lojas"
  on public.lojas
  for update
  to authenticated
  using (true)
  with check (true);

create policy "internal_team_delete_lojas"
  on public.lojas
  for delete
  to authenticated
  using (true);

create policy "internal_team_select_erros"
  on public.erros
  for select
  to authenticated
  using (true);

create policy "internal_team_insert_erros"
  on public.erros
  for insert
  to authenticated
  with check (true);

create policy "internal_team_update_erros"
  on public.erros
  for update
  to authenticated
  using (true)
  with check (true);

create policy "internal_team_delete_erros"
  on public.erros
  for delete
  to authenticated
  using (true);

create policy "internal_team_select_tickets"
  on public.tickets
  for select
  to authenticated
  using (true);

create policy "internal_team_insert_tickets"
  on public.tickets
  for insert
  to authenticated
  with check (true);

create policy "internal_team_update_tickets"
  on public.tickets
  for update
  to authenticated
  using (true)
  with check (true);

create policy "internal_team_delete_tickets"
  on public.tickets
  for delete
  to authenticated
  using (true);

create policy "internal_team_select_outbox"
  on public.outbox
  for select
  to authenticated
  using (true);

create policy "internal_team_insert_outbox"
  on public.outbox
  for insert
  to authenticated
  with check (true);

create policy "internal_team_update_outbox"
  on public.outbox
  for update
  to authenticated
  using (true)
  with check (true);

create policy "internal_team_delete_outbox"
  on public.outbox
  for delete
  to authenticated
  using (true);
