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

-- ─── Audio guiado (voz de la Mora) ───────────────────────────────────────────

create or replace function public.ulpan_is_teacher()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'ulpan_role') in ('mora', 'more'),
    false
  );
$$;

create or replace function public.ulpan_can_record()
returns boolean
language sql
stable
as $$
  select public.ulpan_is_teacher()
    and coalesce(
      (auth.jwt() -> 'user_metadata' ->> 'ulpan_can_record') = 'true',
      false
    );
$$;

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
