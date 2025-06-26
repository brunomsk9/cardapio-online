
import { useState, useEffect } from 'react';
import { Database } from '@/integrations/supabase/types';
import { useDomainDetection } from './useDomainDetection';
import { detectRestaurantFromSubdomain, logDetectionSummary } from '@/utils/restaurantDetectionUtils';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export const useSubdomainRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMainDomain, setIsMainDomain] = useState(false);
  
  const domainInfo = useDomainDetection();

  useEffect(() => {
    const handleRestaurantDetection = async () => {
      if (!domainInfo) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Handle main domain case
        if (domainInfo.isMainDomain) {
          console.log('🏠 Main domain detected, showing general menu');
          setIsMainDomain(true);
          setRestaurant(null);
          setLoading(false);
          return;
        }

        // Detect restaurant from subdomain
        const { restaurant: foundRestaurant, error: detectionError } = await detectRestaurantFromSubdomain(domainInfo.subdomain);

        if (foundRestaurant) {
          setRestaurant(foundRestaurant);
          setIsMainDomain(false);
          logDetectionSummary(domainInfo.hostname, domainInfo.subdomain, true);
        } else {
          logDetectionSummary(domainInfo.hostname, domainInfo.subdomain, false);
          
          if (detectionError) {
            throw detectionError;
          }
        }

      } catch (err) {
        console.error('💥 ERROR in handleRestaurantDetection:', err);
        setError(err as Error);
        setRestaurant(null);
        setIsMainDomain(false);
      } finally {
        setLoading(false);
      }
    };

    handleRestaurantDetection();
  }, [domainInfo]);

  return {
    restaurant,
    loading,
    error,
    isMainDomain
  };
};
