-- ============================================================
-- Pinnacle Bug Reporting — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the bugs table
create table if not exists public.bugs (
  id          uuid        primary key default gen_random_uuid(),
  description text        not null,
  image_urls  text[]      not null default '{}',
  status      text        not null default 'Not Fixed'
                          check (status in ('Not Fixed', 'Under Process', 'Developer Fixed', 'Fixed')),
  assignee    text        not null
                          check (assignee in ('Alpesh', 'Paras', 'Kreya', 'Devang', 'Palak')),
  priority    text        not null default 'Medium'
                          check (priority in ('High', 'Medium', 'Low')),
  environment text        not null default 'UAT'
                          check (environment in ('UAT', 'Live', 'Demo', 'Test')),
  date        date        not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. Auto-update updated_at on row changes
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.bugs
  for each row execute procedure public.handle_updated_at();

-- 3. Row Level Security
alter table public.bugs enable row level security;

create policy "Allow all operations" on public.bugs
  for all using (true) with check (true);

-- 4. Storage bucket for bug images
insert into storage.buckets (id, name, public)
values ('bug-images', 'bug-images', true)
on conflict (id) do nothing;

create policy "Public read bug images"
  on storage.objects for select
  using (bucket_id = 'bug-images');

create policy "Anyone can upload bug images"
  on storage.objects for insert
  with check (bucket_id = 'bug-images');

create policy "Anyone can update bug images"
  on storage.objects for update
  using (bucket_id = 'bug-images');

create policy "Anyone can delete bug images"
  on storage.objects for delete
  using (bucket_id = 'bug-images');

-- ============================================================
-- MIGRATION (run if table already exists)
-- ============================================================
-- alter table public.bugs
--   add column if not exists priority text not null default 'Medium'
--     check (priority in ('High', 'Medium', 'Low')),
--   add column if not exists environment text not null default 'UAT'
--     check (environment in ('UAT', 'Live', 'Demo', 'Test'));
--
-- -- update status constraint to include Developer Fixed
-- alter table public.bugs drop constraint if exists bugs_status_check;
-- alter table public.bugs add constraint bugs_status_check
--   check (status in ('Not Fixed', 'Under Process', 'Developer Fixed', 'Fixed'));
