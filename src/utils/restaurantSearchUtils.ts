
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface SearchResult {
  restaurant: Restaurant | null;
  error: Error | null;
}

export const searchRestaurantBySubdomain = async (subdomain: string): Promise<SearchResult> => {
  try {
    console.log('🔍 TESTING DATABASE CONNECTION...');
    
    // First attempt: count total restaurants
    const { count: totalCount, error: countError } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true });

    console.log('📊 TOTAL RESTAURANTS COUNT:', {
      count: totalCount,
      error: countError?.message
    });

    // Second attempt: fetch all restaurants
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
      // Try public restaurant search as fallback
      return await searchPublicRestaurants(subdomain);
    }

    if (allRestaurants && allRestaurants.length > 0) {
      console.log('🔍 Database has restaurants, proceeding with search...');
      logRestaurantDetails(allRestaurants, subdomain);
      
      const foundRestaurant = findRestaurantMatch(allRestaurants, subdomain);
      if (foundRestaurant) {
        return { restaurant: foundRestaurant, error: null };
      }
    }

    // No restaurant found
    const errorMessage = `Restaurante não encontrado para o subdomínio: ${subdomain}`;
    return { restaurant: null, error: new Error(errorMessage) };

  } catch (err) {
    console.error('💥 ERROR in searchRestaurantBySubdomain:', err);
    return { restaurant: null, error: err as Error };
  }
};

const searchPublicRestaurants = async (subdomain: string): Promise<SearchResult> => {
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
    const found = publicRestaurants.find(r => 
      r.subdomain === subdomain || 
      r.subdomain?.toLowerCase() === subdomain.toLowerCase()
    );

    if (found) {
      console.log('✅ Found restaurant via public search:', found.name);
      // Fetch complete restaurant data
      const { data: fullRestaurant, error: fullError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', found.id)
        .single();

      if (fullRestaurant && !fullError) {
        return { restaurant: fullRestaurant, error: null };
      }
    }
  }

  const errorMessage = `Erro de permissão ao buscar restaurante: Acesso negado`;
  return { restaurant: null, error: new Error(errorMessage) };
};

const logRestaurantDetails = (restaurants: Restaurant[], subdomain: string) => {
  restaurants.forEach((rest, index) => {
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
};

const findRestaurantMatch = (restaurants: Restaurant[], subdomain: string): Restaurant | null => {
  // Try exact match first
  const exactMatch = restaurants.find(r => r.subdomain === subdomain && r.is_active);
  if (exactMatch) {
    console.log('✅ Found exact match:', exactMatch.name);
    return exactMatch;
  }

  // Try case-insensitive match
  const caseMatch = restaurants.find(r => 
    r.subdomain?.toLowerCase() === subdomain.toLowerCase() && r.is_active
  );
  if (caseMatch) {
    console.log('✅ Found case-insensitive match:', caseMatch.name);
    return caseMatch;
  }

  return null;
};
