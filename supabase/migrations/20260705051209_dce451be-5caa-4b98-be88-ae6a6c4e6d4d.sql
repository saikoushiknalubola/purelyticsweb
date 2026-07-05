
-- 1) Move SECURITY DEFINER helpers into a private schema (still callable from RLS via OID)
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.has_role(uuid, app_role) SET SCHEMA private;
ALTER FUNCTION public.is_manager_of(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.is_project_member(uuid, uuid) SET SCHEMA private;

REVOKE ALL ON FUNCTION private.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_manager_of(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_project_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_manager_of(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_project_member(uuid, uuid) TO authenticated, service_role;

-- 2) Restrict profiles SELECT so sensitive columns aren't broadcast to every employee
DROP POLICY IF EXISTS "Auth read directory" ON public.profiles;

CREATE POLICY "Profiles: self, admin or manager can read"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR private.has_role(auth.uid(), 'admin'::app_role)
    OR private.is_manager_of(auth.uid(), id)
  );

-- Safe directory view for browsing colleagues (bypasses RLS as owner; only exposes non-sensitive fields)
CREATE OR REPLACE VIEW public.employee_directory AS
SELECT id, full_name, email, avatar_url, department_id, designation, manager_id,
       joining_date, status, employee_id, location, work_mode, employment_type
FROM public.profiles;

GRANT SELECT ON public.employee_directory TO authenticated;

-- 3) Replace WITH CHECK (true) on public INSERT policies with real validation
DROP POLICY IF EXISTS "Anyone can submit beta signup" ON public.beta_signups;
CREATE POLICY "Anyone can submit beta signup"
  ON public.beta_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL
    AND char_length(btrim(name)) BETWEEN 1 AND 100
    AND email IS NOT NULL
    AND char_length(email) BETWEEN 3 AND 255
    AND position('@' in email) > 1
    AND (age IS NULL OR char_length(age) <= 3)
    AND (city IS NULL OR char_length(city) <= 100)
    AND (frustration IS NULL OR char_length(frustration) <= 1000)
    AND (categories IS NULL OR coalesce(array_length(categories, 1), 0) <= 10)
  );

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_signups;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND char_length(email) BETWEEN 3 AND 255
    AND position('@' in email) > 1
  );
