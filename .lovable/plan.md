## Scope

Ship four new Zoho People-style modules end-to-end (schema → RLS → UI → approvals → dashboards) and audit every existing `/people/*` page for consistent spacing, empty states, loading skeletons, and mobile layout.

## New modules

### 1. Training & Learning (LMS)
- **Tables**: `courses`, `course_modules` (ordered lessons), `course_enrollments` (status: not_started/in_progress/completed, progress %), `course_completions` (certificate no., issued_at).
- **Pages**:
  - `/people/learning` — course catalog cards, filter by category, "Enroll" action.
  - `/people/learning/:id` — modules list, mark complete, progress bar, certificate download when 100%.
  - `/people/learning/admin` (admin) — create/edit courses & modules, assign to employees/departments.
- **Dashboard tile**: "Courses in progress" for employees, "Enrollment completion %" for admins.

### 2. Assets & IT Provisioning
- **Tables**: `assets` (tag, category: laptop/monitor/phone/access-card/other, serial, purchase_date, status, condition), `asset_assignments` (asset_id, user_id, assigned_at, returned_at, notes, assigned_by), `asset_requests` (user_id, category, reason, status, decided_by).
- **Pages**:
  - `/people/assets` (employee) — my assigned assets + "Request asset" form + request history.
  - `/people/assets/admin` (admin) — inventory table, assign/return, approve requests.
- **Dashboard tile**: "Assets assigned to you".

### 3. Helpdesk / HR Cases
- **Tables**: `helpdesk_categories`, `helpdesk_tickets` (subject, description, category_id, priority, status, requester_id, assignee_id, sla_due_at, resolved_at), `helpdesk_comments` (threaded replies).
- **Pages**:
  - `/people/helpdesk` — my tickets list + "New ticket".
  - `/people/helpdesk/:id` — ticket detail, comment thread, status transitions.
  - `/people/helpdesk/queue` (admin) — all tickets, assign, filter, SLA badge.
- **Dashboard tile**: "Open tickets" for admin, "My open cases" for employee.

### 4. Travel & Expenses (bonus "most important" module)
- **Tables**: `expense_categories`, `expense_reports` (title, purpose, total, status, submitter_id, approver_id, decided_at), `expense_items` (report_id, category_id, spent_on, amount, currency, merchant, receipt_url), `travel_requests` (destination, from/to date, purpose, estimated_cost, status, approver_id).
- **Pages**:
  - `/people/expenses` — my reports, create report + add items with receipt upload to `people-documents` bucket.
  - `/people/expenses/approvals` (manager) — pending reports, approve/reject with comment.
  - `/people/travel` — my travel requests + new request.
  - `/people/travel/approvals` (manager) — approve/reject.
- **Dashboard tile**: "Pending expense approvals" for managers.

## Security model

- Every new table: `GRANT` for `authenticated` + `service_role`, `ENABLE RLS`.
- Employee policies: self-scoped via `auth.uid()`.
- Manager policies: use existing `private.is_manager_of(auth.uid(), user_id)` helper.
- Admin policies: use `private.has_role(auth.uid(), 'admin')`.
- Receipts stored in existing `people-documents` bucket under `expenses/{user_id}/…`.

## Global UI/UX polish pass

Apply consistently to every `/people/*` page:
- **Loading**: replace inline "Loading…" text with `<Skeleton>` blocks matching the card/table shape.
- **Empty states**: standard component with icon, headline, one-line hint, primary action.
- **Spacing**: unified `space-y-6/8` rhythm, consistent `PageHeader` usage.
- **Tables**: sticky header, zebra rows, mobile → stacked card fallback under `md`.
- **Mobile**: verify no horizontal overflow, sidebar drawer closes on nav, header offsets correct.
- **Nav highlighting**: audit `end` prop on every parent route with children so only one item highlights.
- **Toasts**: standardize success/error copy via `sonner`.

## Routing additions in `src/App.tsx`

```
/people/learning              → Learning
/people/learning/:id          → LearningDetail
/people/learning/admin        → LearningAdmin  (admin gated)
/people/assets                → Assets
/people/assets/admin          → AssetsAdmin    (admin gated)
/people/helpdesk              → Helpdesk
/people/helpdesk/:id          → HelpdeskTicket
/people/helpdesk/queue        → HelpdeskQueue  (admin gated)
/people/expenses              → Expenses
/people/expenses/approvals    → ExpenseApprovals (manager)
/people/travel                → Travel
/people/travel/approvals      → TravelApprovals  (manager)
```

Sidebar in `PeopleLayout.tsx` gets grouped sections: **Work** (Attendance, Leaves, Timesheets), **Growth** (Goals, Reviews, Learning), **Services** (Assets, Helpdesk, Expenses, Travel), **Admin** (Employees, Payroll, Announcements, Settings).

## Execution order

1. Migration 1 — Learning tables + RLS + grants.
2. Migration 2 — Assets tables + RLS + grants.
3. Migration 3 — Helpdesk tables + RLS + grants.
4. Migration 4 — Expenses & Travel tables + RLS + grants.
5. Build pages + wire routes + sidebar sections.
6. Regenerate types, refactor Dashboard to add new tiles.
7. Global polish pass: shared `<EmptyState>` and `<LoadingCard>` helpers, apply across all People pages.
8. Playwright smoke: sign in, visit each new route, verify no console errors and no layout overflow at mobile + desktop.

## Technical notes

- Reuse existing helpers in `private` schema (`has_role`, `is_manager_of`).
- Certificate PDF: client-side generation with `jspdf` on completion (no server work).
- File uploads reuse existing `people-documents` bucket with per-user prefix RLS already in place.
- No new external services; all AI-adjacent features skipped for this pass.

## Out of scope (future phases)

- Recruitment/ATS, shift scheduling, org chart visualization, mobile push notifications, Slack/Teams integration — flag for a later phase.
