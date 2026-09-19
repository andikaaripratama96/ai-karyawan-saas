-- AI Karyawan SaaS — Fix: isi profil untuk user yang sudah terdaftar sebelum trigger dibuat
-- Jalankan DI SATU KALI di Supabase Dashboard → SQL Editor → Run
-- Aman: hanya menambah baris yang hilang, tidak menghapus/mengubah data apa pun.

insert into public.profiles (id, full_name, company_name)
select
  u.id,
  u.raw_user_meta_data ->> 'full_name',
  u.raw_user_meta_data ->> 'company_name'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;