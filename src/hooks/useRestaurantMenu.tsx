
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export const useRestaurantMenu = (restaurant: Restaurant | null) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!restaurant) {
        setMenuItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching menu items for restaurant:', restaurant.name);

        const { data, error: fetchError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurant.id)
          .eq('available', true)
          .order('category')
          .order('name');

        if (fetchError) {
          console.error('Error fetching menu items:', fetchError);
          throw fetchError;
        }

        console.log('Fetched menu items:', data?.length || 0);
        setMenuItems(data || []);
      } catch (err) {
        console.error('Error fetching restaurant menu:', err);
        setError(err as Error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurant]);

  return {
    menuItems,
    loading,
    error,
    refetch: () => fetchMenuItems()
  };
};
