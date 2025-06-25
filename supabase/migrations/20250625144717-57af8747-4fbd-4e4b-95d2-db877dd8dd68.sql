
-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_restaurants junction table for many-to-many relationship
CREATE TABLE public.user_restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Enable RLS on both tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_restaurants ENABLE ROW LEVEL SECURITY;

-- RLS policies for restaurants table
-- Super admins can see all restaurants
CREATE POLICY "Super admins can view all restaurants" 
  ON public.restaurants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Users can only see restaurants they're associated with
CREATE POLICY "Users can view their restaurants" 
  ON public.restaurants 
  FOR SELECT 
  USING (
    id IN (
      SELECT restaurant_id FROM public.user_restaurants 
      WHERE user_id = auth.uid()
    )
  );

-- Super admins can manage all restaurants
CREATE POLICY "Super admins can manage all restaurants" 
  ON public.restaurants 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS policies for user_restaurants table
-- Super admins can see all associations
CREATE POLICY "Super admins can view all user restaurant associations" 
  ON public.user_restaurants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Users can see their own associations
CREATE POLICY "Users can view their own restaurant associations" 
  ON public.user_restaurants 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Super admins can manage all associations
CREATE POLICY "Super admins can manage all user restaurant associations" 
  ON public.user_restaurants 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );
