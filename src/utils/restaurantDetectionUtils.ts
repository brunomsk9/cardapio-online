
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
    console.log('🔍 STARTING restaurant detection for subdomain:', subdomain);

    // Check authentication status (for logging purposes)
    const { session } = await checkAuthenticationStatus();
    console.log('🔐 Authentication status during restaurant detection:', {
      isAuthenticated: !!session,
      userId: session?.user?.id || 'Not authenticated'
    });

    // Search for restaurant by subdomain (now works without authentication thanks to RLS policy)
    const { restaurant: foundRestaurant, error: searchError } = await searchRestaurantBySubdomain(subdomain);

    if (foundRestaurant) {
      console.log('✅ RESTAURANT DETECTION SUCCESS:', {
        restaurantName: foundRestaurant.name,
        restaurantId: foundRestaurant.id,
        subdomain: foundRestaurant.subdomain,
        searchedSubdomain: subdomain
      });
      return { restaurant: foundRestaurant, error: null };
    } else {
      console.log('❌ RESTAURANT DETECTION FAILED:', {
        searchedSubdomain: subdomain,
        errorMessage: searchError?.message || 'No restaurant found'
      });
      
      if (searchError) {
        return { restaurant: null, error: searchError };
      }
      
      return { restaurant: null, error: new Error(`No restaurant found for subdomain: ${subdomain}`) };
    }

  } catch (err) {
    console.error('💥 UNEXPECTED ERROR in detectRestaurantFromSubdomain:', err);
    return { restaurant: null, error: err as Error };
  }
};

export const logDetectionSummary = (hostname: string, subdomain: string, found: boolean) => {
  console.log('🎯 RESTAURANT DETECTION SUMMARY:', {
    hostname,
    extractedSubdomain: subdomain,
    restaurantFound: found,
    timestamp: new Date().toISOString()
  });
};
