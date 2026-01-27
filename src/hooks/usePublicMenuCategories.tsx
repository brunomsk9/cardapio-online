import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PublicCategory {
  id: string;
  name: string;
  display_order: number | null;
}

export const usePublicMenuCategories = (restaurantId: string | null) => {
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurantId) {
        setCategories([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch visible categories (system defaults + restaurant-specific)
        const { data, error } = await supabase
          .from('menu_categories')
          .select('id, name, display_order')
          .or(`restaurant_id.is.null,restaurant_id.eq.${restaurantId}`)
          .eq('visible_on_menu', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching public categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurantId]);

  return { categories, loading };
};
