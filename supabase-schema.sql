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

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
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

alter table public.exam_records enable row level security;
alter table public.board_note_records enable row level security;

drop policy if exists "exam_records_select_own" on public.exam_records;
create policy "exam_records_select_own"
on public.exam_records for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "exam_records_insert_own" on public.exam_records;
create policy "exam_records_insert_own"
on public.exam_records for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "exam_records_update_own" on public.exam_records;
create policy "exam_records_update_own"
on public.exam_records for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "exam_records_delete_own" on public.exam_records;
create policy "exam_records_delete_own"
on public.exam_records for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "board_note_records_select_own" on public.board_note_records;
create policy "board_note_records_select_own"
on public.board_note_records for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "board_note_records_insert_own" on public.board_note_records;
create policy "board_note_records_insert_own"
on public.board_note_records for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "board_note_records_update_own" on public.board_note_records;
create policy "board_note_records_update_own"
on public.board_note_records for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "board_note_records_delete_own" on public.board_note_records;
create policy "board_note_records_delete_own"
on public.board_note_records for delete
to authenticated
using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.exam_records to authenticated;
grant select, insert, update, delete on public.board_note_records to authenticated;
