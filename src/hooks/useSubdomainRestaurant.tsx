
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

        // 🚨 NOVO: Verificar autenticação
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        console.log('🔐 AUTH STATUS:', {
          hasSession: !!session,
          userId: session?.user?.id,
          authError: authError?.message
        });

        // 🚨 NOVO: Tentar busca sem RLS (usando service_role seria ideal, mas vamos tentar contornar)
        console.log('🔍 TESTING DATABASE CONNECTION...');
        
        // Primeira tentativa: contar total de restaurantes (isso deve funcionar mesmo com RLS)
        const { count: totalCount, error: countError } = await supabase
          .from('restaurants')
          .select('*', { count: 'exact', head: true });

        console.log('📊 TOTAL RESTAURANTS COUNT:', {
          count: totalCount,
          error: countError?.message
        });

        // Segunda tentativa: buscar todos restaurantes (pode falhar por RLS)
        console.log('📋 Fetching ALL restaurants for comparison...');
        const { data: allRestaurants, error: allError } = await supabase
          .from('restaurants')
          .select('*');

        console.log('📊 ALL RESTAURANTS QUERY:', {
          data: allRestaurants,
          count: allRestaurants?.length || 0,
          error: allError?.message,
          errorCode: allError?.code,
          errorDetails: allError?.details,
          hint: allError?.hint
        });

        if (allError) {
          console.error('❌ RLS ERROR detected:', allError);
          // Se há erro de RLS, vamos tentar uma abordagem diferente
          
          // Tentar buscar apenas restaurantes ativos publicamente
          console.log('🔍 Trying public restaurant search...');
          const { data: publicRestaurants, error: publicError } = await supabase
            .from('restaurants')
            .select('id, name, subdomain, is_active')
            .eq('is_active', true);

          console.log('🌐 PUBLIC RESTAURANTS:', {
            data: publicRestaurants,
            count: publicRestaurants?.length || 0,
            error: publicError?.message
          });

          if (publicRestaurants && publicRestaurants.length > 0) {
            // Filtrar por subdomínio no JavaScript
            const found = publicRestaurants.find(r => 
              r.subdomain === subdomain || 
              r.subdomain?.toLowerCase() === subdomain.toLowerCase()
            );

            if (found) {
              console.log('✅ Found restaurant via public search:', found.name);
              // Buscar dados completos do restaurante encontrado
              const { data: fullRestaurant, error: fullError } = await supabase
                .from('restaurants')
                .select('*')
                .eq('id', found.id)
                .single();

              if (fullRestaurant && !fullError) {
                setRestaurant(fullRestaurant);
                setIsMainDomain(false);
                return;
              }
            }
          }
        }

        if (allRestaurants && allRestaurants.length > 0) {
          console.log('🔍 Database has restaurants, proceeding with search...');
          allRestaurants.forEach((rest, index) => {
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

          // Buscar correspondência exata primeiro
          const exactMatch = allRestaurants.find(r => r.subdomain === subdomain && r.is_active);
          if (exactMatch) {
            console.log('✅ Found exact match:', exactMatch.name);
            setRestaurant(exactMatch);
            setIsMainDomain(false);
            return;
          }

          // Buscar correspondência case-insensitive
          const caseMatch = allRestaurants.find(r => 
            r.subdomain?.toLowerCase() === subdomain.toLowerCase() && r.is_active
          );
          if (caseMatch) {
            console.log('✅ Found case-insensitive match:', caseMatch.name);
            setRestaurant(caseMatch);
            setIsMainDomain(false);
            return;
          }
        }

        // Se chegou até aqui, não encontrou o restaurante
        console.log('❌ FINAL RESULT: No restaurant found for subdomain:', subdomain);
        console.log('🔍 SEARCH SUMMARY:', {
          hostname,
          extractedSubdomain: subdomain,
          totalRestaurants: allRestaurants?.length || 0,
          searchAttempts: 'all',
          found: false,
          hasAuthSession: !!session,
          hasRLSError: !!allError
        });
        
        const errorMessage = allError 
          ? `Erro de permissão ao buscar restaurante: ${allError.message}`
          : `Restaurante não encontrado para o subdomínio: ${subdomain}`;
        
        throw new Error(errorMessage);

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
