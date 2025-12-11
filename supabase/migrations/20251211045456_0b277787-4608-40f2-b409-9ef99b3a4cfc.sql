-- Create beta signups table
CREATE TABLE public.beta_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age TEXT,
  city TEXT,
  categories TEXT[],
  frustration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit beta signup" 
ON public.beta_signups 
FOR INSERT 
WITH CHECK (true);

-- Create index on email for uniqueness checks
CREATE INDEX idx_beta_signups_email ON public.beta_signups(email);