
-- Create user_roles table to manage user permissions
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'kitchen', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
CREATE POLICY "Users can view all user roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage user roles" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );
