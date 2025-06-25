
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log('Fetching user role for user:', user?.id);
      
      if (!user) {
        console.log('No user found, setting role to null');
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Querying user_roles table for user_id:', user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        console.log('User roles query result:', { data, error });

        if (error) {
          console.error('Error fetching user role:', error);
          // If no role found, default to 'user'
          if (error.code === 'PGRST116') {
            console.log('No role found, defaulting to user');
            setUserRole('user');
          } else {
            setUserRole('user');
          }
        } else {
          console.log('User role found:', data?.role);
          setUserRole(data?.role || 'user');
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = userRole === 'admin';
  const isKitchen = userRole === 'kitchen';
  
  console.log('useUserRole state:', { userRole, isAdmin, isKitchen, loading, userId: user?.id });

  return {
    userRole,
    isAdmin,
    isKitchen,
    loading
  };
};
