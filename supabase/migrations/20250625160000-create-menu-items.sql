
-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items
CREATE POLICY "Users can view available menu items"
  ON public.menu_items
  FOR SELECT
  USING (available = true);

CREATE POLICY "Super admins can manage all menu items"
  ON public.menu_items
  FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Admins can manage their restaurant menu items"
  ON public.menu_items
  FOR ALL
  USING (
    public.is_admin_or_super() AND
    restaurant_id IN (
      SELECT restaurant_id FROM public.user_restaurants 
      WHERE user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX idx_menu_items_restaurant_id ON public.menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
