CREATE TABLE public.kudos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge text NOT NULL DEFAULT 'thanks',
  message text NOT NULL,
  visibility text NOT NULL DEFAULT 'public',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX kudos_to_user_idx ON public.kudos(to_user);
CREATE INDEX kudos_from_user_idx ON public.kudos(from_user);
CREATE INDEX kudos_created_idx ON public.kudos(created_at DESC);
GRANT SELECT, INSERT ON public.kudos TO authenticated;
GRANT ALL ON public.kudos TO service_role;
ALTER TABLE public.kudos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read public or own kudos" ON public.kudos FOR SELECT TO authenticated
  USING (visibility = 'public' OR from_user = auth.uid() OR to_user = auth.uid());
CREATE POLICY "Send kudos" ON public.kudos FOR INSERT TO authenticated
  WITH CHECK (from_user = auth.uid() AND to_user <> auth.uid());