
# Purelytics People — HRMS Module

A Zoho People-inspired HRMS lives under `/people`. Root admin (`hello@purelytics.tech`) is the only account that can sign up directly; everyone else is provisioned by admin. All data is wired to Lovable Cloud (Supabase) with strict RLS.

## Auth model
- **Public signup is disabled.** Sign-in page at `/people/login` (email + password).
- **Root admin** bootstrap: on first login attempt by `hello@purelytics.tech` with password `Koushik@2330`, account is created automatically and granted the `admin` role. No other email can self-register.
- Roles stored in a separate `user_roles` table (`admin` | `manager` | `employee`) with `has_role()` security-definer function — never on profiles.
- Admin provisions employees from the Admin panel: enters name/email/department/role → backend Edge Function creates the auth user with a temporary password and emails it (or shows it once to admin). Employee logs in and is prompted to change password.

## Core features (v1, Zoho People-inspired)

### 1. Employee Directory
- Admin: create / edit / deactivate employees, assign department, designation, manager, joining date, role.
- Employees: view own profile, edit limited fields (phone, address, emergency contact).
- Org-wide searchable directory with avatar, name, designation, department, email.

### 2. Attendance — Check-in / Check-out
- Big **Check In / Check Out** card on employee dashboard with live running timer for the current session.
- One open session per user at a time; multiple sessions allowed per day (break in/out).
- Daily summary: total hours worked, first check-in, last check-out, status (Present / Half-day / Absent based on hours threshold).
- Captures timestamp, optional note, IP (from edge function), source (web).

### 3. Attendance Logs & Reports
- Employee view: calendar/list of own attendance with daily totals.
- Admin/Manager view: company-wide attendance table with filters (date range, employee, department, status), CSV export.
- Monthly summary per employee: working days, present, absent, total hours, avg hours/day.

### 4. Leave Management
- Leave types: Casual, Sick, Earned, Unpaid (seeded; admin can edit balances).
- Employee: apply leave (type, from, to, reason) → status Pending.
- Manager/Admin: approve / reject with comment.
- Balances tracked per employee per type per year.

### 5. Company Dashboard
- **Admin dashboard:** today's headcount present / on leave / absent, live check-ins feed, pending leave approvals, total employees, department breakdown.
- **Employee dashboard:** check-in widget, today's hours, this week's hours, leave balance, pending requests, announcements.

### 6. Announcements (lightweight)
- Admin posts company-wide announcements shown on every dashboard.

### 7. Settings (admin)
- Working hours per day (default 8h), full-day threshold, half-day threshold, weekend days.
- Manage departments and designations.

## Routes
```
/people/login                  Sign in (root admin auto-bootstraps)
/people                        Dashboard (role-aware)
/people/attendance             My attendance + check-in
/people/attendance/all         Admin/manager: all employees
/people/leaves                 My leaves + apply
/people/leaves/approvals       Manager/admin: approvals queue
/people/directory              Employee directory
/people/employees              Admin: provision / edit employees
/people/settings               Admin: org settings, departments, leave types
/people/profile                My profile
```

## Data model (Lovable Cloud)
- `profiles` — id (auth.users), full_name, email, phone, avatar_url, department_id, designation, manager_id, joining_date, status (active/inactive)
- `app_role` enum: `admin | manager | employee`
- `user_roles` — user_id, role  (separate table, has_role() function)
- `departments` — name
- `attendance_sessions` — user_id, check_in_at, check_out_at, note, source
- `attendance_days` (view or derived) — per-day rollup
- `leave_types` — name, default_annual_quota, paid
- `leave_balances` — user_id, leave_type_id, year, total, used
- `leave_requests` — user_id, leave_type_id, from_date, to_date, days, reason, status, reviewer_id, reviewer_note
- `announcements` — title, body, posted_by
- `org_settings` — singleton: working_hours, full_day_threshold_hours, half_day_threshold_hours, weekend_days[]

RLS:
- Employees: read own profile/attendance/leaves; insert own attendance & leave requests.
- Managers: read direct reports + approve their leaves.
- Admins: full access via `has_role(auth.uid(),'admin')`.
- Directory (profiles basic fields) readable by any authenticated user.

## Edge Functions
- `provision-employee` (admin only) — creates auth user with temp password using service role, inserts profile + role + leave balances, returns temp password to admin once.
- `bootstrap-root-admin` (public, locked to one email) — on first call by `hello@purelytics.tech` with the configured password, creates the user and grants admin role; no-op afterwards.
- `attendance-checkin` / `attendance-checkout` — validates open session state, writes timestamps server-side.

## UI / design
- Reuse existing Purelytics design tokens (cream bg, olive primary, gold accent, Playfair headings, Plus Jakarta body).
- App-shell layout for `/people/*`: left sidebar (nav, role-aware), top bar (org name, user menu, sign out), main content. Mobile: collapsible drawer.
- Shadcn primitives: Card, Table, Tabs, Dialog, Form, Select, Calendar, Toast. Recharts for dashboard charts.
- Tone stays Purelytics — no hype, no AI avatars. Use initials avatars and lucide icons.

## Out of scope for v1 (can add later)
Payroll, performance reviews, timesheets per project, document storage, biometric/geofence check-in, shift scheduling, holidays calendar import, mobile app.

## Build order
1. Migration: enum, tables, RLS, GRANTs, has_role(), seeds (leave types, org_settings, default department).
2. Edge functions: `bootstrap-root-admin`, `provision-employee`, `attendance-checkin`, `attendance-checkout`.
3. `/people` shell: layout, sidebar, auth guard, login page with root-admin bootstrap call.
4. Employee dashboard + check-in widget + my attendance.
5. Admin: employees CRUD, all-attendance view, settings.
6. Leaves: apply, approvals, balances.
7. Announcements, directory, dashboard charts, polish.

Confirm and I'll start with the database migration.
