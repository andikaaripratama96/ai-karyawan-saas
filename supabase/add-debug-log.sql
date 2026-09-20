-- AI Karyawan SaaS — tabel log diagnosis gambar (sementara, untuk debug)
-- Jalankan di Supabase Dashboard → SQL Editor → Run

create table if not exists public.debug_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id text,
  kind text,
  payload jsonb
);

alter table public.debug_log enable row level security;

create policy "public read own debug_log"
  on public.debug_log for select
  to anon, authenticated
  using (true);

create policy "public insert debug_log"
  on public.debug_log for insert
  to anon, authenticated
  with check (true);