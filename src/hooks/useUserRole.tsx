
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log('🔍 Fetching user role for user:', user?.id, 'email:', user?.email);
      
      if (!user) {
        console.log('❌ No user found, resetting role immediately');
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('📡 Querying user_roles table for user_id:', user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('📊 User roles query result:', { data, error, userEmail: user.email });

        if (error) {
          console.error('❌ Error fetching user role:', error);
          console.log('⚠️ Defaulting to user role due to error');
          setUserRole('user');
        } else if (!data) {
          console.log('⚠️ No role found in database, defaulting to user role');
          setUserRole('user');
        } else {
          console.log('✅ User role found:', data.role, 'for user:', user.email);
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('💥 Exception in fetchUserRole:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Reset role immediately when user changes
  useEffect(() => {
    if (!user) {
      console.log('🔄 User logged out, resetting role state immediately');
      setUserRole(null);
    }
  }, [user]);

  const isAdmin = userRole === 'admin';
  const isKitchen = userRole === 'kitchen';
  
  console.log('📋 useUserRole final state:', { 
    userEmail: user?.email,
    userId: user?.id, 
    userRole, 
    isAdmin, 
    isKitchen, 
    loading 
  });

  return {
    userRole,
    isAdmin,
    isKitchen,
    loading
  };
};
