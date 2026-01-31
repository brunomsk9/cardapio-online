-- Allow restaurant admins to update their own restaurant settings
CREATE POLICY "Restaurant admins can update their restaurant" 
ON public.restaurants 
FOR UPDATE 
USING (
  is_admin_or_super() AND (
    id IN (
      SELECT restaurant_id 
      FROM user_restaurants 
      WHERE user_id = auth.uid()
    )
  )
)
WITH CHECK (
  is_admin_or_super() AND (
    id IN (
      SELECT restaurant_id 
      FROM user_restaurants 
      WHERE user_id = auth.uid()
    )
  )
);