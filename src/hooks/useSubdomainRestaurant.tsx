
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

        // Detectar o hostname atual
        const hostname = window.location.hostname;
        console.log('Current hostname:', hostname);

        // Verificar se é um dos domínios principais
        const mainDomains = ['koombo.online', 'ko-ombo.online', 'localhost'];
        if (mainDomains.includes(hostname)) {
          console.log('Main domain detected, showing general menu');
          setIsMainDomain(true);
          setRestaurant(null);
          setLoading(false);
          return;
        }

        // Extrair subdomínio de qualquer um dos domínios suportados
        let subdomain = '';
        if (hostname.includes('.koombo.online')) {
          subdomain = hostname.replace('.koombo.online', '');
        } else if (hostname.includes('.ko-ombo.online')) {
          subdomain = hostname.replace('.ko-ombo.online', '');
        }

        console.log('Detected subdomain:', subdomain);

        if (!subdomain) {
          console.log('No subdomain detected, treating as main domain');
          setIsMainDomain(true);
          setRestaurant(null);
          setLoading(false);
          return;
        }

        // Debug da sessão do usuário
        console.log('DEBUG: Checking user session...');
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        console.log('DEBUG: Session data:', session);
        console.log('DEBUG: Session error:', sessionError);

        // Primeiro, vamos listar TODOS os restaurantes para debug - SEM FILTROS
        console.log('DEBUG: Fetching ALL restaurants (no filters)...');
        const { data: allRestaurantsNoFilter, error: allErrorNoFilter } = await supabase
          .from('restaurants')
          .select('*');

        console.log('DEBUG: Raw query result (no filters):', allRestaurantsNoFilter);
        console.log('DEBUG: Raw query error (no filters):', allErrorNoFilter);

        // Agora com filtro is_active
        console.log('DEBUG: Fetching restaurants with is_active filter...');
        const { data: allRestaurants, error: allError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('is_active', true);

        console.log('DEBUG: Filtered query result:', allRestaurants);
        console.log('DEBUG: Filtered query error:', allError);

        if (allError) {
          console.error('Error fetching restaurants:', allError);
        } else {
          console.log('DEBUG: All active restaurants in database:', allRestaurants);
          console.log('DEBUG: Total active restaurants found:', allRestaurants?.length || 0);
          
          // Log cada restaurante individualmente
          allRestaurants?.forEach((rest, index) => {
            console.log(`DEBUG: Restaurant ${index + 1}:`, {
              id: rest.id,
              name: rest.name,
              subdomain: rest.subdomain,
              is_active: rest.is_active
            });
          });
        }

        // Agora buscar especificamente pelo subdomínio
        console.log('DEBUG: Searching for restaurant with subdomain:', subdomain);
        const { data, error: fetchError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('subdomain', subdomain)
          .eq('is_active', true)
          .maybeSingle();

        console.log('DEBUG: Specific subdomain query result:', data);
        console.log('DEBUG: Specific subdomain query error:', fetchError);

        if (fetchError) {
          console.error('Error fetching restaurant by subdomain:', fetchError);
          throw fetchError;
        }

        if (!data) {
          console.log('No restaurant found for subdomain:', subdomain);
          
          // Debug adicional: buscar sem filtro de is_active
          console.log('DEBUG: Searching without is_active filter...');
          const { data: dataWithoutFilter, error: errorWithoutFilter } = await supabase
            .from('restaurants')
            .select('*')
            .eq('subdomain', subdomain);
            
          console.log('DEBUG: Result without is_active filter:', dataWithoutFilter);
          console.log('DEBUG: Error without is_active filter:', errorWithoutFilter);
          
          throw new Error(`Restaurante não encontrado para o subdomínio: ${subdomain}`);
        }

        console.log('Found restaurant:', data.name, 'with subdomain:', data.subdomain);
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
