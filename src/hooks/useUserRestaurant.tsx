
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export const useUserRestaurant = () => {
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRestaurants = async () => {
      if (!user) {
        setRestaurants([]);
        setSelectedRestaurant(null);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Super admins podem ver todos os restaurantes
        if (isSuperAdmin) {
          const { data, error: restaurantError } = await supabase
            .from('restaurants')
            .select('*')
            .order('name');

          if (restaurantError) {
            throw restaurantError;
          }

          setRestaurants(data || []);
          
          // Se há apenas um restaurante, seleciona automaticamente
          if (data && data.length === 1) {
            setSelectedRestaurant(data[0]);
          }
        } else {
          // Para outros usuários, buscar apenas restaurantes associados
          const { data: userRestaurants, error: userRestaurantsError } = await supabase
            .from('user_restaurants')
            .select(`
              restaurant:restaurants(*)
            `)
            .eq('user_id', user.id);

          if (userRestaurantsError) {
            throw userRestaurantsError;
          }

          const restaurantData = userRestaurants?.map(ur => ur.restaurant).filter(Boolean) as Restaurant[] || [];
          setRestaurants(restaurantData);
          
          // Se há apenas um restaurante, seleciona automaticamente
          if (restaurantData && restaurantData.length === 1) {
            setSelectedRestaurant(restaurantData[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching user restaurants:', err);
        setError(err as Error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && !roleLoading) {
      fetchUserRestaurants();
    }
  }, [user, authLoading, isSuperAdmin, roleLoading]);

  const selectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    // Salva no localStorage para persistir a seleção
    localStorage.setItem('selectedRestaurantId', restaurant.id);
  };

  // Carrega restaurante selecionado do localStorage
  useEffect(() => {
    if (restaurants.length > 0 && !selectedRestaurant) {
      const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
      if (savedRestaurantId) {
        const savedRestaurant = restaurants.find(r => r.id === savedRestaurantId);
        if (savedRestaurant) {
          setSelectedRestaurant(savedRestaurant);
        }
      }
    }
  }, [restaurants, selectedRestaurant]);

  return {
    restaurants,
    selectedRestaurant,
    selectRestaurant,
    loading: authLoading || roleLoading || loading,
    error,
    hasMultipleRestaurants: restaurants.length > 1
  };
};

