-- Add featured column to menu_items
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- Add index for faster featured queries
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON public.menu_items(featured) WHERE featured = true;