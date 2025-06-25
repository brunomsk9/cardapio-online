
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export const useUserRestaurant = () => {
  const { user, loading: authLoading } = useAuth();
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
      } catch (err) {
        console.error('Error fetching user restaurants:', err);
        setError(err as Error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRestaurants();
    }
  }, [user, authLoading]);

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
    loading: authLoading || loading,
    error,
    hasMultipleRestaurants: restaurants.length > 1
  };
};
