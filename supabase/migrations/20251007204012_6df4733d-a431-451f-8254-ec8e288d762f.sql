-- Create menu_categories table
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_system_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(restaurant_id, name)
);

-- Enable RLS
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Allow public to view categories
CREATE POLICY "Public can view menu categories"
ON public.menu_categories
FOR SELECT
USING (true);

-- Super admins manage all categories
CREATE POLICY "Super admins manage all categories"
ON public.menu_categories
FOR ALL
USING (is_super_admin());

-- Restaurant managers manage their categories
CREATE POLICY "Restaurant managers manage their categories"
ON public.menu_categories
FOR ALL
USING (
  is_admin_or_super() AND 
  restaurant_id IN (
    SELECT restaurant_id FROM user_restaurants WHERE user_id = auth.uid()
  )
);

-- Insert default system categories
INSERT INTO public.menu_categories (name, is_system_default, display_order) VALUES
  ('Entradas', true, 1),
  ('Pratos Principais', true, 2),
  ('Acompanhamentos', true, 3),
  ('Bebidas', true, 4),
  ('Sobremesas', true, 5),
  ('Lanches', true, 6),
  ('Pizzas', true, 7),
  ('Massas', true, 8)
ON CONFLICT DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();