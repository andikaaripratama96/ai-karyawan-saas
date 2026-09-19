-- AI Karyawan SaaS — Kuota generate gambar per bulan
-- Jalankan di Supabase Dashboard → SQL Editor

alter table public.profiles
  add column if not exists images_used_month integer not null default 0,
  add column if not exists images_limit integer not null default 100,
  add column if not exists images_quota_month text; -- contoh '2026-09'