-- Add logo_size column to restaurants table
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS logo_size integer DEFAULT 120;

COMMENT ON COLUMN public.restaurants.logo_size IS 'Logo display size in pixels (width)';