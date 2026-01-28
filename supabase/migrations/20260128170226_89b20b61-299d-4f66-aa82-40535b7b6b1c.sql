-- Create storage bucket for restaurant images
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to restaurant images
CREATE POLICY "Public can view restaurant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'restaurant-images');

-- Allow authenticated admins to upload restaurant images
CREATE POLICY "Admins can upload restaurant images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'restaurant-images' 
  AND (
    public.is_super_admin() 
    OR public.is_admin_or_super()
  )
);

-- Allow authenticated admins to update restaurant images
CREATE POLICY "Admins can update restaurant images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'restaurant-images' 
  AND (
    public.is_super_admin() 
    OR public.is_admin_or_super()
  )
);

-- Allow authenticated admins to delete restaurant images
CREATE POLICY "Admins can delete restaurant images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'restaurant-images' 
  AND (
    public.is_super_admin() 
    OR public.is_admin_or_super()
  )
);