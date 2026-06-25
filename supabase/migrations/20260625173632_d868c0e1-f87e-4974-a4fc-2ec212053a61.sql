
-- =====================================================================
-- PURELYTICS PEOPLE (HRMS) — schema, RLS, grants, seeds
-- =====================================================================

-- Roles enum
do $$ begin
  create type public.app_role as enum ('admin','manager','employee');
exception when duplicate_object then null; end $$;

-- Common updated_at trigger fn
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================
-- user_roles
-- =========================
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

drop policy if exists "Users can view their own roles" on public.user_roles;
create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================
-- departments
-- =========================
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);
grant select on public.departments to authenticated;
grant all on public.departments to service_role;
alter table public.departments enable row level security;

drop policy if exists "Auth read departments" on public.departments;
create policy "Auth read departments" on public.departments
  for select to authenticated using (true);

drop policy if exists "Admins manage departments" on public.departments;
create policy "Admins manage departments" on public.departments
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================
-- profiles
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  department_id uuid references public.departments(id) on delete set null,
  designation text,
  manager_id uuid references auth.users(id) on delete set null,
  joining_date date,
  status text not null default 'active', -- active | inactive
  address text,
  emergency_contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- Manager check helper
create or replace function public.is_manager_of(_manager uuid, _employee uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = _employee and manager_id = _manager)
$$;

drop policy if exists "Auth read directory" on public.profiles;
create policy "Auth read directory" on public.profiles
  for select to authenticated using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'))
  with check (id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins insert profiles" on public.profiles;
create policy "Admins insert profiles" on public.profiles
  for insert to authenticated
  with check (public.has_role(auth.uid(),'admin') or id = auth.uid());

drop policy if exists "Admins delete profiles" on public.profiles;
create policy "Admins delete profiles" on public.profiles
  for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- attendance_sessions
-- =========================
create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_in_at timestamptz not null default now(),
  check_out_at timestamptz,
  note text,
  source text default 'web',
  created_at timestamptz not null default now()
);
create index if not exists idx_att_user_time on public.attendance_sessions(user_id, check_in_at desc);

grant select, insert, update, delete on public.attendance_sessions to authenticated;
grant all on public.attendance_sessions to service_role;
alter table public.attendance_sessions enable row level security;

drop policy if exists "Read own or admin/manager" on public.attendance_sessions;
create policy "Read own or admin/manager" on public.attendance_sessions
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.has_role(auth.uid(),'admin')
    or public.is_manager_of(auth.uid(), user_id)
  );

drop policy if exists "Insert own attendance" on public.attendance_sessions;
create policy "Insert own attendance" on public.attendance_sessions
  for insert to authenticated
  with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "Update own open session" on public.attendance_sessions;
create policy "Update own open session" on public.attendance_sessions
  for update to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'))
  with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins delete attendance" on public.attendance_sessions;
create policy "Admins delete attendance" on public.attendance_sessions
  for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- =========================
-- leave_types
-- =========================
create table if not exists public.leave_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  default_annual_quota numeric(5,1) not null default 0,
  paid boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.leave_types to authenticated;
grant all on public.leave_types to service_role;
alter table public.leave_types enable row level security;

drop policy if exists "Auth read leave types" on public.leave_types;
create policy "Auth read leave types" on public.leave_types
  for select to authenticated using (true);

drop policy if exists "Admins manage leave types" on public.leave_types;
create policy "Admins manage leave types" on public.leave_types
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================
-- leave_balances
-- =========================
create table if not exists public.leave_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete cascade,
  year int not null,
  total numeric(5,1) not null default 0,
  used numeric(5,1) not null default 0,
  unique (user_id, leave_type_id, year)
);
grant select, insert, update, delete on public.leave_balances to authenticated;
grant all on public.leave_balances to service_role;
alter table public.leave_balances enable row level security;

drop policy if exists "Read own balances or admin/manager" on public.leave_balances;
create policy "Read own balances or admin/manager" on public.leave_balances
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.has_role(auth.uid(),'admin')
    or public.is_manager_of(auth.uid(), user_id)
  );

drop policy if exists "Admins manage balances" on public.leave_balances;
create policy "Admins manage balances" on public.leave_balances
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================
-- leave_requests
-- =========================
create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete restrict,
  from_date date not null,
  to_date date not null,
  days numeric(5,1) not null,
  reason text,
  status text not null default 'pending', -- pending | approved | rejected | cancelled
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_lr_user on public.leave_requests(user_id);
create index if not exists idx_lr_status on public.leave_requests(status);

drop trigger if exists trg_lr_updated on public.leave_requests;
create trigger trg_lr_updated before update on public.leave_requests
  for each row execute function public.tg_set_updated_at();

grant select, insert, update, delete on public.leave_requests to authenticated;
grant all on public.leave_requests to service_role;
alter table public.leave_requests enable row level security;

drop policy if exists "Read own leaves or admin/manager" on public.leave_requests;
create policy "Read own leaves or admin/manager" on public.leave_requests
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.has_role(auth.uid(),'admin')
    or public.is_manager_of(auth.uid(), user_id)
  );

drop policy if exists "Insert own leave request" on public.leave_requests;
create policy "Insert own leave request" on public.leave_requests
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Update by owner or approver" on public.leave_requests;
create policy "Update by owner or approver" on public.leave_requests
  for update to authenticated
  using (
    (user_id = auth.uid() and status = 'pending')
    or public.has_role(auth.uid(),'admin')
    or public.is_manager_of(auth.uid(), user_id)
  )
  with check (
    user_id = user_id
  );

drop policy if exists "Admin delete leave" on public.leave_requests;
create policy "Admin delete leave" on public.leave_requests
  for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- =========================
-- announcements
-- =========================
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  posted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select on public.announcements to authenticated;
grant all on public.announcements to service_role;
alter table public.announcements enable row level security;

drop policy if exists "Auth read announcements" on public.announcements;
create policy "Auth read announcements" on public.announcements
  for select to authenticated using (true);

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements" on public.announcements
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================
-- org_settings (singleton)
-- =========================
create table if not exists public.org_settings (
  id int primary key default 1,
  working_hours numeric(4,2) not null default 8,
  full_day_threshold_hours numeric(4,2) not null default 8,
  half_day_threshold_hours numeric(4,2) not null default 4,
  weekend_days int[] not null default '{0,6}', -- 0=Sun,6=Sat
  updated_at timestamptz not null default now(),
  constraint org_settings_singleton check (id = 1)
);
grant select on public.org_settings to authenticated;
grant all on public.org_settings to service_role;
alter table public.org_settings enable row level security;

drop policy if exists "Auth read org settings" on public.org_settings;
create policy "Auth read org settings" on public.org_settings
  for select to authenticated using (true);

drop policy if exists "Admins update org settings" on public.org_settings;
create policy "Admins update org settings" on public.org_settings
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================
-- Seeds
-- =========================
insert into public.departments (name) values ('General')
on conflict (name) do nothing;

insert into public.leave_types (name, default_annual_quota, paid) values
  ('Casual', 12, true),
  ('Sick',   10, true),
  ('Earned', 15, true),
  ('Unpaid', 0,  false)
on conflict (name) do nothing;

insert into public.org_settings (id) values (1)
on conflict (id) do nothing;
