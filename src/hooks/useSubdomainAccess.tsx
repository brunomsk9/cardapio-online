
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';
import { useUserRestaurant } from './useUserRestaurant';
import { useDomainDetection } from './useDomainDetection';

interface SubdomainAccessResult {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
  shouldRedirect: boolean;
  redirectUrl?: string;
}

export const useSubdomainAccess = (): SubdomainAccessResult => {
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();
  const { restaurants, loading: restaurantsLoading } = useUserRestaurant();
  const domainInfo = useDomainDetection();
  
  const [hasAccess, setHasAccess] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Se ainda está carregando qualquer dependência, aguarda
        if (authLoading || roleLoading || restaurantsLoading || !domainInfo) {
          console.log('🔄 Still loading dependencies, waiting...');
          return;
        }

        console.log('🔍 Checking subdomain access...');
        setLoading(true);
        setError(null);
        setShouldRedirect(false);
        setRedirectUrl(undefined);

        // Se não há usuário logado, permite acesso (será tratado pela autenticação)
        if (!user) {
          console.log('👤 No user logged in, allowing access for authentication');
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Super admin pode acessar qualquer domínio
        if (isSuperAdmin) {
          console.log('👑 Super admin detected, allowing access to all domains');
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Se estiver no domínio principal (sem subdomínio específico)
        // Permite acesso para usuários autenticados - útil para preview/desenvolvimento
        if (domainInfo.isMainDomain) {
          console.log('🏠 Main domain detected, allowing access for authenticated users');
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Verifica se o usuário tem acesso ao subdomínio atual
        const currentSubdomain = domainInfo.subdomain;
        const userHasAccessToSubdomain = restaurants && restaurants.some(restaurant => 
          restaurant.subdomain === currentSubdomain
        );

        if (!userHasAccessToSubdomain) {
          console.log(`🚫 User does not have access to subdomain: ${currentSubdomain}`);
          setHasAccess(false);
          setError(`Você não tem permissão para acessar este restaurante.`);
          
          // Redireciona para o primeiro restaurante do usuário, se houver
          if (restaurants && restaurants.length > 0) {
            const firstRestaurant = restaurants[0];
            if (firstRestaurant.subdomain) {
              const redirectDomain = window.location.hostname.includes('koombo.online') 
                ? `${firstRestaurant.subdomain}.koombo.online`
                : window.location.hostname.includes('ko-ombo.online')
                ? `${firstRestaurant.subdomain}.ko-ombo.online`
                : `${firstRestaurant.subdomain}.localhost:3000`;
              
              setRedirectUrl(`${window.location.protocol}//${redirectDomain}`);
              setShouldRedirect(true);
            }
          }
        } else {
          console.log(`✅ User has access to subdomain: ${currentSubdomain}`);
          setHasAccess(true);
        }

      } catch (err) {
        console.error('💥 Error checking subdomain access:', err);
        setError('Erro ao verificar permissões de acesso.');
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, isSuperAdmin, restaurants, domainInfo, authLoading, roleLoading, restaurantsLoading]);

  return {
    hasAccess,
    loading: authLoading || roleLoading || restaurantsLoading || loading,
    error,
    shouldRedirect,
    redirectUrl
  };
};
