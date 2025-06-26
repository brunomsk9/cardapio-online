
import { useState, useEffect } from 'react';
import { Database } from '@/integrations/supabase/types';
import { extractDomainInfo } from '@/utils/domainUtils';
import { searchRestaurantBySubdomain } from '@/utils/restaurantSearchUtils';
import { checkAuthenticationStatus } from '@/utils/authUtils';

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

        // Extract domain information
        const domainInfo = extractDomainInfo();

        // Handle main domain case
        if (domainInfo.isMainDomain) {
          setIsMainDomain(true);
          setRestaurant(null);
          setLoading(false);
          return;
        }

        // Check authentication status
        await checkAuthenticationStatus();

        // Search for restaurant by subdomain
        const { restaurant: foundRestaurant, error: searchError } = await searchRestaurantBySubdomain(domainInfo.subdomain);

        if (foundRestaurant) {
          setRestaurant(foundRestaurant);
          setIsMainDomain(false);
        } else {
          console.log('❌ FINAL RESULT: No restaurant found for subdomain:', domainInfo.subdomain);
          console.log('🔍 SEARCH SUMMARY:', {
            hostname: domainInfo.hostname,
            extractedSubdomain: domainInfo.subdomain,
            found: false
          });
          
          if (searchError) {
            throw searchError;
          }
        }

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
