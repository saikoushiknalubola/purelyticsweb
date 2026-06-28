## What's already shipped this turn

- Removed the "F6S #1 Top Company · June 2026" chip from the hero
- Hero headline now uses a premium word-by-word blur-and-rise reveal
- Every section title (Features, How it works, Why Purelytics, Use Cases, Testimonials, FAQ, CTA) now animates word-by-word on scroll using a shared `AnimatedHeading` component
- Mobile menu fixed: now uses `position: fixed`, full-height scrollable panel, dimmed backdrop
- **F6S badge fix for Netlify**: image was hosted on Lovable's CDN (`/__l5e/...`) which doesn't resolve on `purelytics.tech`. Downloaded the badge into `src/assets/` so Vite bundles it into the Netlify build. Push to GitHub and the badge will appear on the live site.

## People — next features (proposed phasing)

Building all four modules in one shot would be a 1500+ line change and impossible to review safely. Here's a phased rollout. Each phase is one migration + one set of pages, fully wired and shippable on its own.

### Phase 1 — Documents & Onboarding
- Tables: `documents` (file storage, type, employee, visibility), `onboarding_templates`, `onboarding_tasks`, `employee_onboarding`
- Storage bucket `people-documents` with RLS (employee sees own, admin sees all)
- Pages:
  - `/people/documents` — upload, categorize (Offer Letter, ID Proof, Contract, Payslip, Other), preview, download
  - `/people/onboarding` — admin creates checklist templates; new hire sees their checklist with progress
  - In Add Employee dialog: auto-assign onboarding template + upload offer letter

### Phase 2 — Timesheets & Projects
- Tables: `projects` (name, client, billable, status), `project_members`, `timesheet_entries` (date, hours, project, task, billable, notes), `timesheet_weeks` (submission/approval status)
- Pages:
  - `/people/projects` — admin/manager CRUD projects, assign members
  - `/people/timesheets` — weekly grid (Mon–Sun × projects), inline hour entry, submit week
  - `/people/timesheet-approvals` — manager queue, approve/reject with notes
  - Dashboard widget: billable vs non-billable hours this week

### Phase 3 — Performance & Goals
- Tables: `review_cycles` (quarterly/annual), `goals` (KRA/OKR, owner, target, progress, status), `goal_checkins`, `reviews` (self + manager), `one_on_ones` (notes, action items)
- Pages:
  - `/people/goals` — employee creates goals, updates progress; manager sees team goals
  - `/people/reviews` — cycle-based self review form + manager review + rating
  - `/people/one-on-ones` — recurring 1:1 notes between employee and manager
  - Dashboard widget: open goals, upcoming reviews

### Phase 4 — Payroll & Payslips
- Tables: `salary_structures` (employee, ctc, basic, hra, allowances, deductions, effective_from), `payroll_runs` (month, status, totals), `payslips` (per employee per run, gross, deductions, net, PDF URL)
- Edge function: `generate-payslip` (renders HTML → PDF, uploads to storage bucket `payslips`)
- Pages:
  - `/people/payroll` — admin sets salary structure per employee, runs monthly payroll, locks the run
  - `/people/payslips` — employee sees list of monthly payslips, downloads PDF
  - Dashboard widget: latest payslip card with net pay

### Cross-cutting
- Update People sidebar with new nav groups: **Work** (Attendance, Timesheets, Projects), **Growth** (Goals, Reviews, 1:1s), **Records** (Documents, Onboarding, Payroll, Payslips)
- All policies follow existing pattern: self + manager (via `is_manager_of`) + admin (via `has_role`)
- All file storage in private Supabase Storage buckets with signed-URL downloads

## What I need from you

Reply with **"start phase 1"** (or whichever phase you want first) and I'll ship the full migration + pages in the next turn. I'll move through phases sequentially as you approve each.
