
import { Database } from '@/integrations/supabase/types';
import { searchRestaurantBySubdomain } from '@/utils/restaurantSearchUtils';
import { checkAuthenticationStatus } from '@/utils/authUtils';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantDetectionResult {
  restaurant: Restaurant | null;
  error: Error | null;
}

export const detectRestaurantFromSubdomain = async (subdomain: string): Promise<RestaurantDetectionResult> => {
  try {
    console.log('🔍 Starting restaurant detection for subdomain:', subdomain);

    // Check authentication status
    await checkAuthenticationStatus();

    // Search for restaurant by subdomain
    const { restaurant: foundRestaurant, error: searchError } = await searchRestaurantBySubdomain(subdomain);

    if (foundRestaurant) {
      console.log('✅ Restaurant found:', foundRestaurant.name);
      return { restaurant: foundRestaurant, error: null };
    } else {
      console.log('❌ FINAL RESULT: No restaurant found for subdomain:', subdomain);
      
      if (searchError) {
        return { restaurant: null, error: searchError };
      }
      
      return { restaurant: null, error: new Error(`No restaurant found for subdomain: ${subdomain}`) };
    }

  } catch (err) {
    console.error('💥 ERROR in detectRestaurantFromSubdomain:', err);
    return { restaurant: null, error: err as Error };
  }
};

export const logDetectionSummary = (hostname: string, subdomain: string, found: boolean) => {
  console.log('🔍 SEARCH SUMMARY:', {
    hostname,
    extractedSubdomain: subdomain,
    found
  });
};
