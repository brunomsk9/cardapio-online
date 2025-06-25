
-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (using CASCADE to handle dependencies)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Super admins can update all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles CASCADE;

-- Create policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Super admins can update all profiles
CREATE POLICY "Super admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update user_roles policies to allow super admins to see all roles
DROP POLICY IF EXISTS "Super admins can view all user roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON public.user_roles CASCADE;

CREATE POLICY "Super admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage all user roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
    )
  );

-- Update user_restaurants policies for super admins
DROP POLICY IF EXISTS "Super admins can view all user restaurant associations" ON public.user_restaurants CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all user restaurant associations" ON public.user_restaurants CASCADE;

CREATE POLICY "Super admins can view all user restaurant associations"
  ON public.user_restaurants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage all user restaurant associations"
  ON public.user_restaurants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
    )
  );
