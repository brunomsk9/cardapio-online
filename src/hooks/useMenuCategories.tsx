import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRestaurant } from './useUserRestaurant';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];

export const useMenuCategories = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch system default categories and restaurant-specific categories
      let query = supabase
        .from('menu_categories')
        .select('*')
        .order('display_order', { ascending: true });

      // Get system defaults and restaurant-specific categories
      if (selectedRestaurant) {
        query = query.or(`restaurant_id.is.null,restaurant_id.eq.${selectedRestaurant.id}`);
      } else {
        query = query.is('restaurant_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Ensure visible_on_menu is set (for backwards compatibility)
      const categoriesWithVisibility = (data || []).map(cat => ({
        ...cat,
        visible_on_menu: cat.visible_on_menu ?? true
      }));

      setCategories(categoriesWithVisibility);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedRestaurant]);

  const createCategory = async (name: string) => {
    if (!selectedRestaurant) {
      toast({
        title: "Erro",
        description: "Selecione um restaurante primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert({
          name,
          restaurant_id: selectedRestaurant.id,
          is_system_default: false,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      toast({
        title: "Categoria criada!",
        description: `Categoria "${name}" criada com sucesso.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setCategories(categories.filter(c => c.id !== categoryId));
      toast({
        title: "Categoria excluída!",
        description: "Categoria excluída com sucesso.",
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    categories,
    loading,
    createCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};