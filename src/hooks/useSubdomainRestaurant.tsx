
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
        console.log('🔍 HOSTNAME DETECTION:', hostname);

        // Verificar se é um dos domínios principais
        const mainDomains = ['koombo.online', 'ko-ombo.online', 'localhost'];
        if (mainDomains.includes(hostname)) {
          console.log('🏠 Main domain detected, showing general menu');
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

        console.log('🎯 EXTRACTED SUBDOMAIN:', {
          original: hostname,
          extracted: subdomain,
          length: subdomain.length,
          type: typeof subdomain
        });

        if (!subdomain) {
          console.log('❌ No subdomain detected, treating as main domain');
          setIsMainDomain(true);
          setRestaurant(null);
          setLoading(false);
          return;
        }

        // Primeiro, vamos buscar TODOS os restaurantes para debug
        console.log('📋 Fetching ALL restaurants for comparison...');
        const { data: allRestaurants, error: allError } = await supabase
          .from('restaurants')
          .select('*');

        if (allError) {
          console.error('❌ Error fetching all restaurants:', allError);
        } else {
          console.log('📊 ALL RESTAURANTS IN DATABASE:', allRestaurants?.length || 0);
          allRestaurants?.forEach((rest, index) => {
            console.log(`Restaurant ${index + 1}:`, {
              id: rest.id,
              name: rest.name,
              subdomain: rest.subdomain,
              subdomain_length: rest.subdomain?.length || 0,
              subdomain_type: typeof rest.subdomain,
              is_active: rest.is_active,
              exact_match: rest.subdomain === subdomain,
              lowercase_match: rest.subdomain?.toLowerCase() === subdomain.toLowerCase(),
              trimmed_match: rest.subdomain?.trim() === subdomain.trim()
            });
          });
        }

        // Tentativa 1: Busca exata
        console.log('🔍 ATTEMPT 1: Exact match search...');
        const { data: exactMatch, error: exactError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('subdomain', subdomain)
          .eq('is_active', true);

        console.log('📤 Exact match query result:', {
          data: exactMatch,
          error: exactError,
          count: exactMatch?.length || 0
        });

        if (exactMatch && exactMatch.length > 0) {
          console.log('✅ Found restaurant via exact match:', exactMatch[0].name);
          setRestaurant(exactMatch[0]);
          setIsMainDomain(false);
          return;
        }

        // Tentativa 2: Busca case-insensitive
        console.log('🔍 ATTEMPT 2: Case insensitive search...');
        const { data: caseInsensitiveMatch, error: caseError } = await supabase
          .from('restaurants')
          .select('*')
          .ilike('subdomain', subdomain)
          .eq('is_active', true);

        console.log('📤 Case insensitive query result:', {
          data: caseInsensitiveMatch,
          error: caseError,
          count: caseInsensitiveMatch?.length || 0
        });

        if (caseInsensitiveMatch && caseInsensitiveMatch.length > 0) {
          console.log('✅ Found restaurant via case insensitive match:', caseInsensitiveMatch[0].name);
          setRestaurant(caseInsensitiveMatch[0]);
          setIsMainDomain(false);
          return;
        }

        // Tentativa 3: Buscar todos ativos e filtrar no JavaScript
        console.log('🔍 ATTEMPT 3: JavaScript filter search...');
        const { data: activeRestaurants, error: activeError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('is_active', true);

        console.log('📤 Active restaurants query result:', {
          data: activeRestaurants,
          error: activeError,
          count: activeRestaurants?.length || 0
        });

        if (activeRestaurants && activeRestaurants.length > 0) {
          console.log('🔍 Filtering restaurants in JavaScript...');
          
          // Diferentes tentativas de match
          const matches = {
            exact: activeRestaurants.filter(r => r.subdomain === subdomain),
            lowercase: activeRestaurants.filter(r => r.subdomain?.toLowerCase() === subdomain.toLowerCase()),
            trimmed: activeRestaurants.filter(r => r.subdomain?.trim() === subdomain.trim()),
            bothTrimmedLower: activeRestaurants.filter(r => r.subdomain?.trim().toLowerCase() === subdomain.trim().toLowerCase())
          };

          console.log('🎯 JavaScript filter results:', {
            searchTerm: subdomain,
            exact: matches.exact.length,
            lowercase: matches.lowercase.length,
            trimmed: matches.trimmed.length,
            bothTrimmedLower: matches.bothTrimmedLower.length
          });

          // Tentar cada tipo de match
          for (const [matchType, matchResults] of Object.entries(matches)) {
            if (matchResults.length > 0) {
              console.log(`✅ Found restaurant via ${matchType} match:`, matchResults[0].name);
              setRestaurant(matchResults[0]);
              setIsMainDomain(false);
              return;
            }
          }
        }

        // Tentativa 4: Busca com LIKE pattern
        console.log('🔍 ATTEMPT 4: LIKE pattern search...');
        const { data: likeMatch, error: likeError } = await supabase
          .from('restaurants')
          .select('*')
          .like('subdomain', `%${subdomain}%`)
          .eq('is_active', true);

        console.log('📤 LIKE pattern query result:', {
          data: likeMatch,
          error: likeError,
          count: likeMatch?.length || 0
        });

        if (likeMatch && likeMatch.length > 0) {
          console.log('✅ Found restaurant via LIKE pattern:', likeMatch[0].name);
          setRestaurant(likeMatch[0]);
          setIsMainDomain(false);
          return;
        }

        // Se chegou até aqui, não encontrou o restaurante
        console.log('❌ FINAL RESULT: No restaurant found for subdomain:', subdomain);
        console.log('🔍 SEARCH SUMMARY:', {
          hostname,
          extractedSubdomain: subdomain,
          totalRestaurants: allRestaurants?.length || 0,
          activeRestaurants: activeRestaurants?.length || 0,
          searchAttempts: 4,
          found: false
        });
        
        throw new Error(`Restaurante não encontrado para o subdomínio: ${subdomain}`);

      } catch (err) {
        console.error('💥 ERROR in detectRestaurantFromSubdomain:', err);
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
