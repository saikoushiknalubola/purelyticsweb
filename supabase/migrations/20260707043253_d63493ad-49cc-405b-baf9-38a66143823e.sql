
-- Site visitor counter
CREATE TABLE IF NOT EXISTS public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamptz NOT NULL DEFAULT now(),
  path text,
  ua text
);

GRANT SELECT, INSERT ON public.site_visits TO anon;
GRANT SELECT, INSERT ON public.site_visits TO authenticated;
GRANT ALL ON public.site_visits TO service_role;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sv anyone read" ON public.site_visits FOR SELECT USING (true);
CREATE POLICY "sv anyone insert" ON public.site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "sv admin delete" ON public.site_visits FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Seed default expense categories
INSERT INTO public.expense_categories (name) VALUES
  ('Travel'), ('Meals'), ('Lodging'), ('Software'), ('Office Supplies'), ('Other')
ON CONFLICT (name) DO NOTHING;
