
import { supabase } from '@/integrations/supabase/client';

export const checkAuthenticationStatus = async () => {
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  console.log('🔐 AUTH STATUS:', {
    hasSession: !!session,
    userId: session?.user?.id,
    authError: authError?.message
  });
  
  return { session, authError };
};
