
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
    
    // Buscar restaurante específico por subdomínio (sem autenticação necessária)
    const { data: restaurant, error: searchError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('is_active', true)
      .maybeSingle();

    console.log('📊 DIRECT SUBDOMAIN SEARCH:', {
      subdomain,
      found: !!restaurant,
      restaurant: restaurant?.name || 'Not found',
      error: searchError?.message,
      errorCode: searchError?.code
    });

    if (searchError) {
      console.error('❌ Database error during search:', searchError);
      return { restaurant: null, error: searchError };
    }

    if (restaurant) {
      console.log('✅ Restaurant found:', restaurant.name);
      return { restaurant, error: null };
    }

    // Se não encontrou com busca direta, tentar busca case-insensitive
    console.log('🔍 Trying case-insensitive search...');
    const { data: caseInsensitiveResult, error: caseError } = await supabase
      .from('restaurants')
      .select('*')
      .ilike('subdomain', subdomain)
      .eq('is_active', true)
      .maybeSingle();

    console.log('📊 CASE-INSENSITIVE SEARCH:', {
      subdomain,
      found: !!caseInsensitiveResult,
      restaurant: caseInsensitiveResult?.name || 'Not found',
      error: caseError?.message
    });

    if (caseInsensitiveResult) {
      return { restaurant: caseInsensitiveResult, error: null };
    }

    // Buscar todos os restaurantes ativos para debug
    const { data: allRestaurants, error: allError } = await supabase
      .from('restaurants')
      .select('id, name, subdomain, is_active')
      .eq('is_active', true);

    console.log('📋 ALL ACTIVE RESTAURANTS:', {
      count: allRestaurants?.length || 0,
      restaurants: allRestaurants?.map(r => ({
        name: r.name,
        subdomain: r.subdomain,
        matches: r.subdomain === subdomain || r.subdomain?.toLowerCase() === subdomain.toLowerCase()
      })) || [],
      error: allError?.message
    });

    const errorMessage = `Restaurante não encontrado para o subdomínio: ${subdomain}`;
    return { restaurant: null, error: new Error(errorMessage) };

  } catch (err) {
    console.error('💥 ERROR in searchRestaurantBySubdomain:', err);
    return { restaurant: null, error: err as Error };
  }
};
