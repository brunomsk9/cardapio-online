
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface SearchResult {
  restaurant: Restaurant | null;
  error: Error | null;
}

export const searchRestaurantBySubdomain = async (subdomain: string): Promise<SearchResult> => {
  try {
    console.log('🔍 SEARCHING for restaurant with subdomain:', subdomain);
    
    // Buscar restaurante específico por subdomínio (agora funciona sem autenticação graças à RLS policy)
    const { data: restaurant, error: searchError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('is_active', true)
      .maybeSingle();

    console.log('📊 DIRECT SUBDOMAIN SEARCH RESULT:', {
      subdomain,
      found: !!restaurant,
      restaurant: restaurant?.name || 'Not found',
      error: searchError?.message,
      errorCode: searchError?.code,
      restaurantId: restaurant?.id
    });

    if (searchError) {
      console.error('❌ Database error during search:', searchError);
      return { restaurant: null, error: searchError };
    }

    if (restaurant) {
      console.log('✅ Restaurant found successfully:', {
        name: restaurant.name,
        id: restaurant.id,
        subdomain: restaurant.subdomain,
        isActive: restaurant.is_active
      });
      return { restaurant, error: null };
    }

    // Se não encontrou com busca direta, tentar busca case-insensitive
    console.log('🔍 Trying case-insensitive search for subdomain:', subdomain);
    const { data: caseInsensitiveResult, error: caseError } = await supabase
      .from('restaurants')
      .select('*')
      .ilike('subdomain', subdomain)
      .eq('is_active', true)
      .maybeSingle();

    console.log('📊 CASE-INSENSITIVE SEARCH RESULT:', {
      subdomain,
      found: !!caseInsensitiveResult,
      restaurant: caseInsensitiveResult?.name || 'Not found',
      error: caseError?.message,
      restaurantId: caseInsensitiveResult?.id
    });

    if (caseInsensitiveResult) {
      console.log('✅ Restaurant found with case-insensitive search:', caseInsensitiveResult.name);
      return { restaurant: caseInsensitiveResult, error: null };
    }

    // Para debug, buscar todos os restaurantes ativos
    console.log('🔍 Fetching all active restaurants for debugging...');
    const { data: allRestaurants, error: allError } = await supabase
      .from('restaurants')
      .select('id, name, subdomain, is_active')
      .eq('is_active', true);

    console.log('📋 ALL ACTIVE RESTAURANTS DEBUG INFO:', {
      totalCount: allRestaurants?.length || 0,
      searchedSubdomain: subdomain,
      restaurants: allRestaurants?.map(r => ({
        name: r.name,
        subdomain: r.subdomain,
        isActive: r.is_active,
        exactMatch: r.subdomain === subdomain,
        caseInsensitiveMatch: r.subdomain?.toLowerCase() === subdomain.toLowerCase()
      })) || [],
      error: allError?.message
    });

    const errorMessage = `Restaurant not found for subdomain: ${subdomain}`;
    console.log('❌ FINAL RESULT: No restaurant found');
    return { restaurant: null, error: new Error(errorMessage) };

  } catch (err) {
    console.error('💥 UNEXPECTED ERROR in searchRestaurantBySubdomain:', err);
    return { restaurant: null, error: err as Error };
  }
};
