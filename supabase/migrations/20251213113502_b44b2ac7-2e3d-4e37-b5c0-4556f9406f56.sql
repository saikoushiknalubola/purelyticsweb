-- Add restrictive SELECT policy to deny public reads on beta_signups
-- Since there's no admin system, we'll create a policy that denies all client-side reads
-- Admin access should be done via service role key server-side

CREATE POLICY "Deny public read access to beta signups"
ON public.beta_signups
FOR SELECT
USING (false);