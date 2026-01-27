-- Add visible_on_menu column to menu_categories
ALTER TABLE public.menu_categories 
ADD COLUMN IF NOT EXISTS visible_on_menu boolean NOT NULL DEFAULT true;

-- Update existing categories to be visible by default
UPDATE public.menu_categories SET visible_on_menu = true WHERE visible_on_menu IS NULL;