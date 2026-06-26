
-- Profiles: extended employee fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'full_time',
  ADD COLUMN IF NOT EXISTS work_mode TEXT DEFAULT 'office',
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS blood_group TEXT;

-- Attendance: work_mode + notes per session
ALTER TABLE public.attendance_sessions
  ADD COLUMN IF NOT EXISTS work_mode TEXT DEFAULT 'office',
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Attendance breaks
CREATE TABLE IF NOT EXISTS public.attendance_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  break_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  break_end TIMESTAMPTZ,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_breaks TO authenticated;
GRANT ALL ON public.attendance_breaks TO service_role;

ALTER TABLE public.attendance_breaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own breaks" ON public.attendance_breaks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all breaks" ON public.attendance_breaks
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_breaks_updated BEFORE UPDATE ON public.attendance_breaks
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_breaks_session ON public.attendance_breaks(session_id);
CREATE INDEX IF NOT EXISTS idx_breaks_user ON public.attendance_breaks(user_id);

-- Holidays
CREATE TABLE IF NOT EXISTS public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  holiday_date DATE NOT NULL,
  description TEXT,
  is_optional BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (holiday_date, name)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.holidays TO authenticated;
GRANT ALL ON public.holidays TO service_role;

ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view holidays" ON public.holidays
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage holidays" ON public.holidays
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_holidays_updated BEFORE UPDATE ON public.holidays
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
