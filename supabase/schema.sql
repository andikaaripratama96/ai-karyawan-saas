-- AI Karyawan SaaS — Database schema untuk Supabase
-- Jalankan di Supabase Dashboard → SQL Editor

-- PROFILE (satu baris per user, dibuat otomatis oleh trigger saat user daftar)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  plan text not null default 'free', -- free | starter | pro
  stripe_customer_id text,
  stripe_subscription_id text,
  tasks_used_month integer not null default 0,
  tasks_limit integer not null default 10,
  created_at timestamptz not null default now()
);

-- TASKS
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  employee_id text not null, -- content-creator | admin-stok | business-analyst
  status text not null default 'menunggu', -- menunggu | diproses | selesai | gagal
  priority text not null default 'sedang',
  progress integer not null default 0,
  category text,
  result jsonb,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- KNOWLEDGE (file referensi per user)
create table public.knowledge (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  file_type text,
  category text,
  file_url text,
  content_summary text,
  created_at timestamptz not null default now()
);

-- HISTORY (jejak aktivitas)
create table public.history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  employee_id text,
  action text not null,
  at timestamptz not null default now()
);

-- INDEX
create index tasks_user_id_idx on public.tasks(user_id);
create index knowledge_user_id_idx on public.knowledge(user_id);
create index history_user_id_idx on public.history(user_id);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.knowledge enable row level security;
alter table public.history enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can view own tasks"
  on public.tasks for select using (auth.uid() = user_id);
create policy "Users can create own tasks"
  on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks"
  on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks"
  on public.tasks for delete using (auth.uid() = user_id);

create policy "Users can view own knowledge"
  on public.knowledge for select using (auth.uid() = user_id);
create policy "Users can create own knowledge"
  on public.knowledge for insert with check (auth.uid() = user_id);
create policy "Users can delete own knowledge"
  on public.knowledge for delete using (auth.uid() = user_id);

create policy "Users can view own history"
  on public.history for select using (auth.uid() = user_id);

-- TRIGGER: buat profile otomatis setelah signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'company_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();