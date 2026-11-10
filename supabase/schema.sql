-- Ulpan con la Mora Maggie — sync en la nube (Supabase)
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- (Se puede re-ejecutar: usa IF NOT EXISTS / DROP POLICY IF EXISTS)

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

-- ─── Privilegios de grabación (NO editables por el cliente) ──────────────────
-- auth.users.user_metadata es escribible con supabase.auth.updateUser().
-- El permiso de grabar audio compartido vive en esta tabla: el cliente solo
-- puede LEER su fila. Otorgar / revocar se hace en SQL Editor (service_role):
--
--   update public.ulpan_privileges
--   set can_record = true, updated_at = now()
--   where user_id = '<uuid-de-la-mora>';
--
-- Tras aplicar este schema, nadie graba hasta ese UPDATE (fail-closed).

create table if not exists public.ulpan_privileges (
  user_id uuid primary key references auth.users (id) on delete cascade,
  can_record boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.ulpan_privileges enable row level security;

revoke insert, update, delete on public.ulpan_privileges from anon, authenticated, public;
grant select on public.ulpan_privileges to authenticated;

drop policy if exists "ulpan_privileges_select_own" on public.ulpan_privileges;
drop policy if exists "ulpan_privileges_insert" on public.ulpan_privileges;
drop policy if exists "ulpan_privileges_update" on public.ulpan_privileges;
drop policy if exists "ulpan_privileges_delete" on public.ulpan_privileges;

create policy "ulpan_privileges_select_own"
  on public.ulpan_privileges for select
  using (auth.uid() = user_id);

create or replace function public.ulpan_privileges_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ulpan_privileges (user_id, can_record)
  values (new.id, false)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_ulpan_privileges on auth.users;
create trigger on_auth_user_created_ulpan_privileges
  after insert on auth.users
  for each row execute procedure public.ulpan_privileges_on_signup();

insert into public.ulpan_privileges (user_id, can_record)
select id, false from auth.users
on conflict (user_id) do nothing;

-- ─── Audio guiado (voz de la Mora) ───────────────────────────────────────────

create or replace function public.ulpan_can_record()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.can_record from public.ulpan_privileges p where p.user_id = auth.uid()),
    false
  );
$$;

revoke all on function public.ulpan_can_record() from public;
grant execute on function public.ulpan_can_record() to anon, authenticated;

-- Old helper read user_metadata (client-writable). Do not use it in RLS.
drop function if exists public.ulpan_is_teacher();

create table if not exists public.guided_audio (
  clip_id text primary key,
  kind text not null check (kind in ('letter', 'vocab', 'phrase', 'lesson', 'custom')),
  hebrew text not null default '',
  translit text not null default '',
  spanish text not null default '',
  storage_path text not null,
  created_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists guided_audio_kind_idx on public.guided_audio (kind);

alter table public.guided_audio enable row level security;

drop policy if exists "guided_audio_select_all" on public.guided_audio;
drop policy if exists "guided_audio_insert_recorder" on public.guided_audio;
drop policy if exists "guided_audio_update_recorder" on public.guided_audio;
drop policy if exists "guided_audio_delete_recorder" on public.guided_audio;

-- Lectura pública: el audio guiado es contenido del curso
create policy "guided_audio_select_all"
  on public.guided_audio for select
  using (true);

create policy "guided_audio_insert_recorder"
  on public.guided_audio for insert
  with check (auth.uid() = created_by and public.ulpan_can_record());

create policy "guided_audio_update_recorder"
  on public.guided_audio for update
  using (public.ulpan_can_record())
  with check (public.ulpan_can_record());

create policy "guided_audio_delete_recorder"
  on public.guided_audio for delete
  using (public.ulpan_can_record());

-- Bucket de Storage (público en lectura)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guided-audio',
  'guided-audio',
  true,
  5242880,
  array['audio/webm', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/x-m4a', 'audio/mp3']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "guided_audio_storage_select" on storage.objects;
drop policy if exists "guided_audio_storage_insert" on storage.objects;
drop policy if exists "guided_audio_storage_update" on storage.objects;
drop policy if exists "guided_audio_storage_delete" on storage.objects;

create policy "guided_audio_storage_select"
  on storage.objects for select
  using (bucket_id = 'guided-audio');

create policy "guided_audio_storage_insert"
  on storage.objects for insert
  with check (bucket_id = 'guided-audio' and public.ulpan_can_record());

create policy "guided_audio_storage_update"
  on storage.objects for update
  using (bucket_id = 'guided-audio' and public.ulpan_can_record())
  with check (bucket_id = 'guided-audio' and public.ulpan_can_record());

create policy "guided_audio_storage_delete"
  on storage.objects for delete
  using (bucket_id = 'guided-audio' and public.ulpan_can_record());
