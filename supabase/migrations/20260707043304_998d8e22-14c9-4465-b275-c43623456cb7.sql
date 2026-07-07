
DROP POLICY IF EXISTS "sv anyone insert" ON public.site_visits;
REVOKE INSERT ON public.site_visits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_site_visit(_path text DEFAULT NULL, _ua text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.site_visits (path, ua) VALUES (_path, _ua);
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_site_visit(text, text) TO anon, authenticated;
