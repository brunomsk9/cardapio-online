
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export const useSubdomainRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMainDomain, setIsMainDomain] = useState(false);

  useEffect(() => {
    const detectRestaurantFromSubdomain = async () => {
      try {
        setLoading(true);
        setError(null);

        // Detectar o subdomínio atual
        const hostname = window.location.hostname;
        console.log('Current hostname:', hostname);

        // Verificar se é o domínio principal
        if (hostname === 'ko-ombo.online' || hostname === 'localhost') {
          setIsMainDomain(true);
          setRestaurant(null);
          setLoading(false);
          return;
        }

        // Extrair subdomínio (ex: restaurante.ko-ombo.online -> restaurante)
        const subdomain = hostname.split('.')[0];
        console.log('Detected subdomain:', subdomain);

        if (!subdomain || subdomain === 'ko-ombo') {
          setIsMainDomain(true);
          setRestaurant(null);
          setLoading(false);
          return;
        }

        // Buscar restaurante pelo subdomínio
        const { data, error: fetchError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('subdomain', subdomain)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching restaurant by subdomain:', fetchError);
          throw fetchError;
        }

        if (!data) {
          throw new Error(`Restaurante não encontrado para o subdomínio: ${subdomain}`);
        }

        console.log('Found restaurant:', data.name);
        setRestaurant(data);
        setIsMainDomain(false);
      } catch (err) {
        console.error('Error detecting restaurant from subdomain:', err);
        setError(err as Error);
        setRestaurant(null);
        setIsMainDomain(false);
      } finally {
        setLoading(false);
      }
    };

    detectRestaurantFromSubdomain();
  }, []);

  return {
    restaurant,
    loading,
    error,
    isMainDomain
  };
};
