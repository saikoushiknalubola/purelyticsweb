
CREATE TYPE public.document_category AS ENUM (
  'offer_letter','contract','id_proof','address_proof','education','experience','payslip','tax','other'
);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  category public.document_category NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  mime_type text,
  is_confidential boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents_select" ON public.documents FOR SELECT TO authenticated
  USING (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.is_manager_of(auth.uid(), employee_id));
CREATE POLICY "documents_insert" ON public.documents FOR INSERT TO authenticated
  WITH CHECK (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "documents_update" ON public.documents FOR UPDATE TO authenticated
  USING (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "documents_delete" ON public.documents FOR DELETE TO authenticated
  USING (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.onboarding_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_default boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_templates TO authenticated;
GRANT ALL ON public.onboarding_templates TO service_role;
ALTER TABLE public.onboarding_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onb_tpl_select" ON public.onboarding_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "onb_tpl_admin" ON public.onboarding_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_onb_tpl_updated_at BEFORE UPDATE ON public.onboarding_templates
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.onboarding_templates(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_offset_days integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  category text DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_tasks TO authenticated;
GRANT ALL ON public.onboarding_tasks TO service_role;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onb_task_select" ON public.onboarding_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "onb_task_admin" ON public.onboarding_tasks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_onb_task_updated_at BEFORE UPDATE ON public.onboarding_tasks
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.employee_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.onboarding_templates(id) ON DELETE SET NULL,
  start_date date NOT NULL DEFAULT current_date,
  target_complete_date date,
  status text NOT NULL DEFAULT 'in_progress',
  assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_onboarding TO authenticated;
GRANT ALL ON public.employee_onboarding TO service_role;
ALTER TABLE public.employee_onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "emp_onb_select" ON public.employee_onboarding FOR SELECT TO authenticated
  USING (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.is_manager_of(auth.uid(), employee_id));
CREATE POLICY "emp_onb_admin" ON public.employee_onboarding FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_emp_onb_updated_at BEFORE UPDATE ON public.employee_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.employee_onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.onboarding_tasks(id) ON DELETE CASCADE,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id, task_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_onboarding_progress TO authenticated;
GRANT ALL ON public.employee_onboarding_progress TO service_role;
ALTER TABLE public.employee_onboarding_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "emp_onb_prog_select" ON public.employee_onboarding_progress FOR SELECT TO authenticated
  USING (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.is_manager_of(auth.uid(), employee_id));
CREATE POLICY "emp_onb_prog_insert" ON public.employee_onboarding_progress FOR INSERT TO authenticated
  WITH CHECK (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "emp_onb_prog_update" ON public.employee_onboarding_progress FOR UPDATE TO authenticated
  USING (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (employee_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "emp_onb_prog_delete" ON public.employee_onboarding_progress FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_emp_onb_prog_updated_at BEFORE UPDATE ON public.employee_onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DO $$
DECLARE tpl_id uuid;
BEGIN
  INSERT INTO public.onboarding_templates (name, description, is_default)
  VALUES ('Standard New Hire', 'Default Purelytics onboarding checklist for every new joiner', true)
  RETURNING id INTO tpl_id;

  INSERT INTO public.onboarding_tasks (template_id, title, description, due_offset_days, sort_order, category) VALUES
    (tpl_id, 'Sign offer letter', 'Review and sign the offer letter', 0, 1, 'paperwork'),
    (tpl_id, 'Upload ID proof', 'Aadhaar / PAN / Passport', 1, 2, 'paperwork'),
    (tpl_id, 'Upload address proof', 'Utility bill or bank statement', 1, 3, 'paperwork'),
    (tpl_id, 'Upload education documents', 'Highest degree certificate', 2, 4, 'paperwork'),
    (tpl_id, 'Upload experience letters', 'Previous employer relieving letters', 2, 5, 'paperwork'),
    (tpl_id, 'Setup workstation', 'Receive laptop and accessories', 1, 6, 'equipment'),
    (tpl_id, 'Configure work email', 'Sign in to Purelytics email', 1, 7, 'accounts'),
    (tpl_id, 'Join team channels', 'Slack, calendar, project tools', 1, 8, 'accounts'),
    (tpl_id, 'Read employee handbook', 'Code of conduct and policies', 3, 9, 'reading'),
    (tpl_id, 'Meet your manager', 'Intro 1:1 with reporting manager', 1, 10, 'meetings'),
    (tpl_id, 'Team introduction', 'Meet the wider team', 3, 11, 'meetings'),
    (tpl_id, 'Complete tax declaration', 'Submit tax declaration form', 7, 12, 'paperwork');
END $$;
