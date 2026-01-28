-- Add customization columns to restaurants table
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#FF521D',
ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#282828',
ADD COLUMN IF NOT EXISTS hero_image_url text DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.restaurants.primary_color IS 'Custom primary/accent color for the restaurant theme';
COMMENT ON COLUMN public.restaurants.secondary_color IS 'Custom secondary/background color for the restaurant theme';
COMMENT ON COLUMN public.restaurants.hero_image_url IS 'Custom hero image URL for the restaurant home page';