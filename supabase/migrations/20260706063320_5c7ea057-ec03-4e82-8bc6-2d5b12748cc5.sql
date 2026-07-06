
-- ============ LEARNING ============
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  cover_url text,
  duration_minutes int DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses read all authenticated" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "courses admin write" ON public.courses FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  video_url text,
  position int NOT NULL DEFAULT 0,
  duration_minutes int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT ALL ON public.course_modules TO service_role;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules read all" ON public.course_modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "modules admin write" ON public.course_modules FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON public.course_modules FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_modules_course ON public.course_modules(course_id, position);

CREATE TABLE public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started',
  progress int NOT NULL DEFAULT 0,
  completed_modules uuid[] NOT NULL DEFAULT '{}',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  certificate_no text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enroll own read" ON public.course_enrollments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), user_id));
CREATE POLICY "enroll self manage" ON public.course_enrollments FOR ALL TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(),'admin'))
  WITH CHECK (user_id = auth.uid() OR private.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_enroll_updated BEFORE UPDATE ON public.course_enrollments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ ASSETS ============
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  serial_no text,
  purchase_date date,
  purchase_cost numeric(12,2),
  status text NOT NULL DEFAULT 'available',
  condition text NOT NULL DEFAULT 'good',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assets read all" ON public.assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "assets admin write" ON public.assets FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_assets_updated BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.asset_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  returned_at timestamptz,
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_assignments TO authenticated;
GRANT ALL ON public.asset_assignments TO service_role;
ALTER TABLE public.asset_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aa read own or admin" ON public.asset_assignments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), user_id));
CREATE POLICY "aa admin write" ON public.asset_assignments FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_aa_updated BEFORE UPDATE ON public.asset_assignments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.asset_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_requests TO authenticated;
GRANT ALL ON public.asset_requests TO service_role;
ALTER TABLE public.asset_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "areq read own or admin" ON public.asset_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "areq self create" ON public.asset_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "areq self update pending" ON public.asset_requests FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending') WITH CHECK (user_id = auth.uid());
CREATE POLICY "areq admin manage" ON public.asset_requests FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_areq_updated BEFORE UPDATE ON public.asset_requests FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ HELPDESK ============
CREATE TABLE public.helpdesk_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  default_sla_hours int NOT NULL DEFAULT 48,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.helpdesk_categories TO authenticated;
GRANT ALL ON public.helpdesk_categories TO service_role;
ALTER TABLE public.helpdesk_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cat read all" ON public.helpdesk_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "cat admin write" ON public.helpdesk_categories FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

CREATE TABLE public.helpdesk_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES public.helpdesk_categories(id) ON DELETE SET NULL,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sla_due_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.helpdesk_tickets TO authenticated;
GRANT ALL ON public.helpdesk_tickets TO service_role;
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket read own or assignee or admin" ON public.helpdesk_tickets FOR SELECT TO authenticated
  USING (requester_id = auth.uid() OR assignee_id = auth.uid() OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "ticket self create" ON public.helpdesk_tickets FOR INSERT TO authenticated
  WITH CHECK (requester_id = auth.uid());
CREATE POLICY "ticket self edit open" ON public.helpdesk_tickets FOR UPDATE TO authenticated
  USING (requester_id = auth.uid() AND status IN ('open','pending')) WITH CHECK (requester_id = auth.uid());
CREATE POLICY "ticket admin/assignee manage" ON public.helpdesk_tickets FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin') OR assignee_id = auth.uid())
  WITH CHECK (private.has_role(auth.uid(),'admin') OR assignee_id = auth.uid());
CREATE TRIGGER trg_ticket_updated BEFORE UPDATE ON public.helpdesk_tickets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.helpdesk_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.helpdesk_tickets(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.helpdesk_comments TO authenticated;
GRANT ALL ON public.helpdesk_comments TO service_role;
ALTER TABLE public.helpdesk_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comment read if ticket visible" ON public.helpdesk_comments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.helpdesk_tickets t WHERE t.id = ticket_id
    AND (t.requester_id = auth.uid() OR t.assignee_id = auth.uid() OR private.has_role(auth.uid(),'admin'))));
CREATE POLICY "comment insert if ticket visible" ON public.helpdesk_comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND EXISTS (SELECT 1 FROM public.helpdesk_tickets t WHERE t.id = ticket_id
    AND (t.requester_id = auth.uid() OR t.assignee_id = auth.uid() OR private.has_role(auth.uid(),'admin'))));

-- ============ EXPENSES ============
CREATE TABLE public.expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.expense_categories TO authenticated;
GRANT ALL ON public.expense_categories TO service_role;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ecat read" ON public.expense_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "ecat admin write" ON public.expense_categories FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

CREATE TABLE public.expense_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  purpose text,
  currency text NOT NULL DEFAULT 'USD',
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  submitter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at timestamptz,
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_reports TO authenticated;
GRANT ALL ON public.expense_reports TO service_role;
ALTER TABLE public.expense_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "er read own/mgr/admin" ON public.expense_reports FOR SELECT TO authenticated
  USING (submitter_id = auth.uid() OR private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), submitter_id));
CREATE POLICY "er self create" ON public.expense_reports FOR INSERT TO authenticated
  WITH CHECK (submitter_id = auth.uid());
CREATE POLICY "er self edit draft" ON public.expense_reports FOR UPDATE TO authenticated
  USING (submitter_id = auth.uid()) WITH CHECK (submitter_id = auth.uid());
CREATE POLICY "er mgr/admin approve" ON public.expense_reports FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), submitter_id))
  WITH CHECK (private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), submitter_id));
CREATE POLICY "er self delete draft" ON public.expense_reports FOR DELETE TO authenticated
  USING (submitter_id = auth.uid() AND status = 'draft');
CREATE TRIGGER trg_er_updated BEFORE UPDATE ON public.expense_reports FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.expense_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.expense_reports(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.expense_categories(id) ON DELETE SET NULL,
  spent_on date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  merchant text,
  description text,
  receipt_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_items TO authenticated;
GRANT ALL ON public.expense_items TO service_role;
ALTER TABLE public.expense_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ei read if report visible" ON public.expense_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.expense_reports r WHERE r.id = report_id
    AND (r.submitter_id = auth.uid() OR private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), r.submitter_id))));
CREATE POLICY "ei submitter manage" ON public.expense_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.expense_reports r WHERE r.id = report_id AND r.submitter_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.expense_reports r WHERE r.id = report_id AND r.submitter_id = auth.uid()));

CREATE TABLE public.travel_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination text NOT NULL,
  from_date date NOT NULL,
  to_date date NOT NULL,
  purpose text NOT NULL,
  estimated_cost numeric(12,2) DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  approver_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.travel_requests TO authenticated;
GRANT ALL ON public.travel_requests TO service_role;
ALTER TABLE public.travel_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tr read own/mgr/admin" ON public.travel_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), user_id));
CREATE POLICY "tr self create" ON public.travel_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "tr self edit pending" ON public.travel_requests FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending') WITH CHECK (user_id = auth.uid());
CREATE POLICY "tr mgr/admin approve" ON public.travel_requests FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), user_id))
  WITH CHECK (private.has_role(auth.uid(),'admin') OR private.is_manager_of(auth.uid(), user_id));
CREATE POLICY "tr self delete pending" ON public.travel_requests FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending');
CREATE TRIGGER trg_tr_updated BEFORE UPDATE ON public.travel_requests FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed helpful defaults
INSERT INTO public.helpdesk_categories (name, description, default_sla_hours) VALUES
  ('HR & Policy', 'Questions about HR policies, benefits, and procedures', 48),
  ('IT Support', 'Technical issues, access requests, software help', 24),
  ('Payroll', 'Salary, tax, and payslip queries', 72),
  ('Facilities', 'Office, seating, and workplace facilities', 72)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.expense_categories (name) VALUES
  ('Travel'), ('Meals & Entertainment'), ('Accommodation'), ('Office Supplies'),
  ('Software & Subscriptions'), ('Training'), ('Client Gifts'), ('Other')
ON CONFLICT (name) DO NOTHING;
