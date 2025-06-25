
-- Função para obter perfis de todos os usuários (apenas para super admin)
CREATE OR REPLACE FUNCTION get_all_users_profiles()
RETURNS TABLE(
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Verifica se o usuário atual é super admin
  SELECT auth.uid() WHERE EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
  
  -- Se chegou até aqui, é super admin
  SELECT 
    au.id,
    au.email,
    au.created_at
  FROM auth.users au
  ORDER BY au.created_at DESC;
$$;

-- Função para obter emails de usuários específicos (apenas para super admin)
CREATE OR REPLACE FUNCTION get_users_emails(user_ids UUID[])
RETURNS TABLE(
  user_id UUID,
  email TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Verifica se o usuário atual é super admin
  SELECT auth.uid() WHERE EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
  
  -- Se chegou até aqui, é super admin
  SELECT 
    au.id as user_id,
    au.email
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
$$;
