create extension if not exists pgcrypto;

create table if not exists public.exam_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id text not null,
  prova text not null,
  scores jsonb not null default '{}'::jsonb,
  total numeric,
  obs text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_note_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id text not null,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.board_note_records
add column if not exists position_x numeric not null default 32,
add column if not exists position_y numeric not null default 32;

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  target_percent numeric check (target_percent >= 1 and target_percent <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exam_records_user_id_idx on public.exam_records(user_id);
create index if not exists board_note_records_user_id_idx on public.board_note_records(user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_exam_records_updated_at on public.exam_records;
create trigger touch_exam_records_updated_at
before update on public.exam_records
for each row execute function public.touch_updated_at();

drop trigger if exists touch_board_note_records_updated_at on public.board_note_records;
create trigger touch_board_note_records_updated_at
before update on public.board_note_records
for each row execute function public.touch_updated_at();

drop trigger if exists touch_user_settings_updated_at on public.user_settings;
create trigger touch_user_settings_updated_at
before update on public.user_settings
for each row execute function public.touch_updated_at();

alter table public.exam_records enable row level security;
alter table public.board_note_records enable row level security;
alter table public.user_settings enable row level security;

drop policy if exists "exam_records_select_own" on public.exam_records;
create policy "exam_records_select_own"
on public.exam_records for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "exam_records_insert_own" on public.exam_records;
create policy "exam_records_insert_own"
on public.exam_records for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "exam_records_update_own" on public.exam_records;
create policy "exam_records_update_own"
on public.exam_records for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "exam_records_delete_own" on public.exam_records;
create policy "exam_records_delete_own"
on public.exam_records for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "board_note_records_select_own" on public.board_note_records;
create policy "board_note_records_select_own"
on public.board_note_records for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "board_note_records_insert_own" on public.board_note_records;
create policy "board_note_records_insert_own"
on public.board_note_records for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "board_note_records_update_own" on public.board_note_records;
create policy "board_note_records_update_own"
on public.board_note_records for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "board_note_records_delete_own" on public.board_note_records;
create policy "board_note_records_delete_own"
on public.board_note_records for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own"
on public.user_settings for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own"
on public.user_settings for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
on public.user_settings for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "user_settings_delete_own" on public.user_settings;
create policy "user_settings_delete_own"
on public.user_settings for delete
to authenticated
using ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.exam_records to authenticated;
grant select, insert, update, delete on public.board_note_records to authenticated;
grant select, insert, update, delete on public.user_settings to authenticated;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
