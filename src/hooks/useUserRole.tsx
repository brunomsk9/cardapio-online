
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Usando a nova função security definer
        const { data, error: roleError } = await supabase
          .rpc('get_current_user_role');

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          // Se der erro, tenta buscar diretamente (fallback)
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();

          if (fallbackError) {
            throw fallbackError;
          }

          setUserRole(fallbackData?.role || 'user');
        } else {
          setUserRole(data || 'user');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err as Error);
        setUserRole('user'); // Fallback para user em caso de erro
      } finally {
        setLoading(false);
      }
    };

    // Só executa se não estiver carregando auth
    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  // Reset estado quando user muda para null
  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setError(null);
    }
  }, [user]);

  const isAdmin = userRole === 'admin';
  const isKitchen = userRole === 'kitchen';
  const isSuperAdmin = userRole === 'super_admin';

  return {
    userRole,
    isAdmin,
    isKitchen,
    isSuperAdmin,
    loading: authLoading || loading,
    error
  };
};
