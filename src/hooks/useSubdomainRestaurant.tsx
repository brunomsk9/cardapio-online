
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

        // Buscar todos os restaurantes primeiro para debug
        console.log('DEBUG: Fetching all restaurants to compare...');
        const { data: allRestaurants, error: allError } = await supabase
          .from('restaurants')
          .select('*');

        if (allError) {
          console.error('Error fetching all restaurants:', allError);
        } else {
          console.log('DEBUG: All restaurants:', allRestaurants);
          allRestaurants?.forEach((rest, index) => {
            console.log(`Restaurant ${index + 1}:`, {
              name: rest.name,
              subdomain: rest.subdomain,
              subdomain_type: typeof rest.subdomain,
              subdomain_matches: rest.subdomain === subdomain,
              is_active: rest.is_active
            });
          });
        }

        // Buscar especificamente pelo subdomínio - vamos tentar diferentes abordagens
        console.log('DEBUG: Searching for subdomain:', subdomain, 'type:', typeof subdomain);
        
        // Primeira tentativa: busca exata
        const { data: exactMatch, error: exactError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('subdomain', subdomain)
          .eq('is_active', true)
          .maybeSingle();

        console.log('DEBUG: Exact match result:', exactMatch);
        console.log('DEBUG: Exact match error:', exactError);

        if (exactMatch) {
          console.log('Found restaurant via exact match:', exactMatch.name);
          setRestaurant(exactMatch);
          setIsMainDomain(false);
          return;
        }

        // Segunda tentativa: busca case-insensitive
        const { data: caseInsensitiveMatch, error: caseError } = await supabase
          .from('restaurants')
          .select('*')
          .ilike('subdomain', subdomain)
          .eq('is_active', true)
          .maybeSingle();

        console.log('DEBUG: Case insensitive match result:', caseInsensitiveMatch);
        console.log('DEBUG: Case insensitive match error:', caseError);

        if (caseInsensitiveMatch) {
          console.log('Found restaurant via case insensitive match:', caseInsensitiveMatch.name);
          setRestaurant(caseInsensitiveMatch);
          setIsMainDomain(false);
          return;
        }

        // Terceira tentativa: buscar todos e filtrar no JavaScript
        const { data: allActiveRestaurants, error: activeError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('is_active', true);

        console.log('DEBUG: All active restaurants:', allActiveRestaurants);
        console.log('DEBUG: Active restaurants error:', activeError);

        if (allActiveRestaurants) {
          const matchedRestaurant = allActiveRestaurants.find(rest => 
            rest.subdomain && rest.subdomain.toLowerCase() === subdomain.toLowerCase()
          );

          console.log('DEBUG: Matched restaurant via JS filter:', matchedRestaurant);

          if (matchedRestaurant) {
            console.log('Found restaurant via JavaScript filter:', matchedRestaurant.name);
            setRestaurant(matchedRestaurant);
            setIsMainDomain(false);
            return;
          }
        }

        // Se chegou até aqui, não encontrou o restaurante
        console.log('No restaurant found for subdomain:', subdomain);
        throw new Error(`Restaurante não encontrado para o subdomínio: ${subdomain}`);

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
