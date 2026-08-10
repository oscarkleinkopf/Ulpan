-- Ulpan con la Mora Maggie — sync en la nube (Supabase)
-- Ejecutar en: Supabase → SQL Editor → New query → Run

create table if not exists public.user_sync (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  classroom jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_sync enable row level security;

drop policy if exists "user_sync_select_own" on public.user_sync;
drop policy if exists "user_sync_insert_own" on public.user_sync;
drop policy if exists "user_sync_update_own" on public.user_sync;
drop policy if exists "user_sync_delete_own" on public.user_sync;

create policy "user_sync_select_own"
  on public.user_sync for select
  using (auth.uid() = user_id);

create policy "user_sync_insert_own"
  on public.user_sync for insert
  with check (auth.uid() = user_id);

create policy "user_sync_update_own"
  on public.user_sync for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_sync_delete_own"
  on public.user_sync for delete
  using (auth.uid() = user_id);
