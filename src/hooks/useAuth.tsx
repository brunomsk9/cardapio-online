
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDomainDetection } from './useDomainDetection';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const domainInfo = useDomainDetection();

  useEffect(() => {
    let mounted = true;

    // Function to handle auth state changes
    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check for super admin role and redirect only if on home page and main domain
        if (session?.user && event === 'SIGNED_IN' && location.pathname === '/' && domainInfo?.isMainDomain) {
          setTimeout(async () => {
            try {
              const { data: roleData } = await supabase
                .rpc('get_current_user_role');
              
              if (roleData === 'super_admin') {
                navigate('/super-admin');
              }
            } catch (error) {
              console.error('Error checking user role:', error);
            }
          }, 100);
        }
      }

      // Handle successful password recovery
      if (event === 'PASSWORD_RECOVERY' && session) {
        console.log('Password recovery successful, user logged in');
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for recovery tokens in URL (for password reset)
    const handleRecoveryToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && refreshToken && type === 'recovery') {
        console.log('Processing recovery token...');
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session from recovery:', error);
          } else {
            console.log('Recovery session set successfully');
            // Clear the URL hash
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Error processing recovery token:', error);
        }
      }
    };

    // Handle recovery token first
    handleRecoveryToken();

    // Then get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, domainInfo?.isMainDomain]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signOut
  };
};
