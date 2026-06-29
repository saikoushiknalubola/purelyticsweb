
-- ============ PROJECTS ============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  client text,
  description text,
  billable boolean not null default true,
  status text not null default 'active', -- active | on_hold | completed | archived
  start_date date,
  end_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;

create policy "projects: all authenticated read" on public.projects
  for select to authenticated using (true);
create policy "projects: admin manage" on public.projects
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'));

create trigger trg_projects_updated before update on public.projects
  for each row execute function public.tg_set_updated_at();

-- ============ PROJECT MEMBERS ============
create table public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_role text not null default 'member', -- member | lead
  allocation_pct int default 100,
  created_at timestamptz not null default now(),
  unique(project_id, user_id)
);
grant select, insert, update, delete on public.project_members to authenticated;
grant all on public.project_members to service_role;
alter table public.project_members enable row level security;

create policy "project_members: read" on public.project_members
  for select to authenticated using (true);
create policy "project_members: admin/manager manage" on public.project_members
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'));

-- helper: is project member
create or replace function public.is_project_member(_user uuid, _project uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.project_members where user_id = _user and project_id = _project)
$$;

-- ============ TIMESHEET WEEKS ============
create table public.timesheet_weeks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null, -- Monday
  status text not null default 'draft', -- draft | submitted | approved | rejected
  submitted_at timestamptz,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_notes text,
  total_hours numeric(6,2) default 0,
  billable_hours numeric(6,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start)
);
grant select, insert, update, delete on public.timesheet_weeks to authenticated;
grant all on public.timesheet_weeks to service_role;
alter table public.timesheet_weeks enable row level security;

create policy "tw: own" on public.timesheet_weeks
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "tw: manager/admin view" on public.timesheet_weeks
  for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.is_manager_of(auth.uid(), user_id));
create policy "tw: manager/admin approve" on public.timesheet_weeks
  for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.is_manager_of(auth.uid(), user_id))
  with check (public.has_role(auth.uid(),'admin') or public.is_manager_of(auth.uid(), user_id));

create trigger trg_tw_updated before update on public.timesheet_weeks
  for each row execute function public.tg_set_updated_at();

-- ============ TIMESHEET ENTRIES ============
create table public.timesheet_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  week_id uuid references public.timesheet_weeks(id) on delete cascade,
  entry_date date not null,
  hours numeric(4,2) not null check (hours >= 0 and hours <= 24),
  task text,
  notes text,
  billable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.timesheet_entries to authenticated;
grant all on public.timesheet_entries to service_role;
alter table public.timesheet_entries enable row level security;

create policy "te: own" on public.timesheet_entries
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "te: manager/admin view" on public.timesheet_entries
  for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.is_manager_of(auth.uid(), user_id));

create trigger trg_te_updated before update on public.timesheet_entries
  for each row execute function public.tg_set_updated_at();

create index idx_te_user_date on public.timesheet_entries(user_id, entry_date);
create index idx_te_week on public.timesheet_entries(week_id);

-- ============ REVIEW CYCLES ============
create table public.review_cycles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  period_start date not null,
  period_end date not null,
  status text not null default 'active', -- active | closed | upcoming
  self_review_due date,
  manager_review_due date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.review_cycles to authenticated;
grant all on public.review_cycles to service_role;
alter table public.review_cycles enable row level security;

create policy "rc: read all" on public.review_cycles for select to authenticated using (true);
create policy "rc: admin manage" on public.review_cycles for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create trigger trg_rc_updated before update on public.review_cycles
  for each row execute function public.tg_set_updated_at();

-- ============ GOALS (OKRs / KRAs) ============
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid references public.review_cycles(id) on delete set null,
  parent_goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  goal_type text not null default 'okr', -- okr | kra | personal
  metric text, -- e.g. "Signups", "%"
  start_value numeric(12,2) default 0,
  target_value numeric(12,2) default 100,
  current_value numeric(12,2) default 0,
  progress_pct int default 0 check (progress_pct between 0 and 100),
  weight int default 1,
  status text not null default 'on_track', -- on_track | at_risk | off_track | completed | dropped
  due_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.goals to authenticated;
grant all on public.goals to service_role;
alter table public.goals enable row level security;

create policy "goals: own" on public.goals
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "goals: manager/admin view" on public.goals
  for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.is_manager_of(auth.uid(), user_id));
create policy "goals: admin manage" on public.goals
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create trigger trg_goals_updated before update on public.goals
  for each row execute function public.tg_set_updated_at();

-- ============ GOAL CHECK-INS ============
create table public.goal_checkins (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  progress_pct int not null check (progress_pct between 0 and 100),
  current_value numeric(12,2),
  status text not null default 'on_track',
  notes text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.goal_checkins to authenticated;
grant all on public.goal_checkins to service_role;
alter table public.goal_checkins enable row level security;

create policy "gc: own" on public.goal_checkins
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "gc: manager/admin view" on public.goal_checkins
  for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.is_manager_of(auth.uid(), user_id));

create index idx_gc_goal on public.goal_checkins(goal_id, created_at);

-- ============ REVIEWS ============
create table public.performance_reviews (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.review_cycles(id) on delete cascade,
  employee_id uuid not null references auth.users(id) on delete cascade,
  reviewer_id uuid references auth.users(id) on delete set null,
  review_type text not null, -- self | manager
  rating int check (rating between 1 and 5),
  strengths text,
  improvements text,
  comments text,
  status text not null default 'draft', -- draft | submitted
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cycle_id, employee_id, review_type)
);
grant select, insert, update, delete on public.performance_reviews to authenticated;
grant all on public.performance_reviews to service_role;
alter table public.performance_reviews enable row level security;

-- self review: employee writes about themself
create policy "pr: self review own" on public.performance_reviews
  for all to authenticated
  using (review_type = 'self' and employee_id = auth.uid())
  with check (review_type = 'self' and employee_id = auth.uid());
-- manager review: reviewer is the manager
create policy "pr: manager review" on public.performance_reviews
  for all to authenticated
  using (review_type = 'manager' and (reviewer_id = auth.uid() or public.is_manager_of(auth.uid(), employee_id) or public.has_role(auth.uid(),'admin')))
  with check (review_type = 'manager' and (reviewer_id = auth.uid() or public.is_manager_of(auth.uid(), employee_id) or public.has_role(auth.uid(),'admin')));
-- employee reads their own reviews (both types)
create policy "pr: employee read own" on public.performance_reviews
  for select to authenticated
  using (employee_id = auth.uid() or public.is_manager_of(auth.uid(), employee_id) or public.has_role(auth.uid(),'admin'));

create trigger trg_pr_updated before update on public.performance_reviews
  for each row execute function public.tg_set_updated_at();

-- ============ SEED ============
insert into public.review_cycles (name, period_start, period_end, status, self_review_due, manager_review_due)
values
  ('Q2 2026', '2026-04-01', '2026-06-30', 'active', '2026-07-10', '2026-07-20'),
  ('H1 2026', '2026-01-01', '2026-06-30', 'upcoming', '2026-07-15', '2026-07-31');
