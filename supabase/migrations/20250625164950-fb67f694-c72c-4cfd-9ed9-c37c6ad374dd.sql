
-- Primeiro, vamos garantir que todos os usuários sincronizados tenham um papel padrão
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'user'::app_role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE ur.user_id IS NULL;

-- Vamos recriar as políticas para user_roles de forma mais permissiva
DROP POLICY IF EXISTS "Super admins manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Permitir super admins visualizarem todos os papéis
CREATE POLICY "Super admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_super_admin());

-- Permitir usuários verem seus próprios papéis
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir super admins inserirem novos papéis
CREATE POLICY "Super admins can insert user roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.is_super_admin());

-- Permitir super admins atualizarem papéis
CREATE POLICY "Super admins can update user roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_super_admin());

-- Permitir super admins deletarem papéis
CREATE POLICY "Super admins can delete user roles"
  ON public.user_roles
  FOR DELETE
  USING (public.is_super_admin());

-- Verificar se a função de sincronização está funcionando corretamente
-- Vamos ajustar o trigger para garantir que novos usuários sempre tenham um papel
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Inserir perfil se não existir
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  
  -- Inserir papel padrão se não existir
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;
