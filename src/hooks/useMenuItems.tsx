
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRestaurant } from './useUserRestaurant';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useMenuItems = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenuItems = async () => {
    if (!selectedRestaurant) {
      setMenuItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching menu items for restaurant:', selectedRestaurant.id);

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', selectedRestaurant.id)
        .order('category')
        .order('name');

      if (fetchError) {
        console.error('Error fetching menu items:', fetchError);
        throw fetchError;
      }

      console.log('Fetched menu items:', data?.length || 0);
      setMenuItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err as Error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [selectedRestaurant]);

  const createMenuItem = async (itemData: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>) => {
    if (!selectedRestaurant) {
      throw new Error('Nenhum restaurante selecionado');
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          ...itemData,
          restaurant_id: selectedRestaurant.id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMenuItems(prev => [...prev, data]);
      }
      return data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMenuItems(prev => prev.map(item => 
          item.id === id ? data : item
        ));
      }
      return data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const toggleAvailability = async (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    try {
      await updateMenuItem(id, { available: !item.available });
    } catch (error) {
      console.error('Error toggling availability:', error);
      throw error;
    }
  };

  const toggleFeatured = async (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    try {
      await updateMenuItem(id, { featured: !item.featured });
    } catch (error) {
      console.error('Error toggling featured:', error);
      throw error;
    }
  };

  return {
    menuItems,
    loading,
    error,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    toggleFeatured,
    refetch: fetchMenuItems
  };
};
