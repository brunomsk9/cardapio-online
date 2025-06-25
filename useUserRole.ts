import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Substitua com suas credenciais Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UserRole {
  role: string | null;
  isLoading: boolean;
  error: Error | null;
}

export const useUserRole = (): UserRole => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (user) {
          const { data, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (roleError && roleError.code !== 'PGRST116') { // PGRST116 means no rows found
            throw roleError;
          }

          setRole(data ? data.role : null);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error('Erro ao buscar perfil do usuário:', err);
        setError(err as Error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();

    // Listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserRole(); // Refetch role if session changes
      } else {
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return { role, isLoading, error };
};


