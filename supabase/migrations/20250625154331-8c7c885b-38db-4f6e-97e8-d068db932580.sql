
-- Primeiro, vamos dropar todas as políticas problemáticas
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Super admins can update all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles CASCADE;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Super admins can view all user roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON public.user_roles CASCADE;

DROP POLICY IF EXISTS "Users can view their restaurants" ON public.restaurants CASCADE;
DROP POLICY IF EXISTS "Super admins can view all restaurants" ON public.restaurants CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all restaurants" ON public.restaurants CASCADE;

DROP POLICY IF EXISTS "Users can view their own restaurant associations" ON public.user_restaurants CASCADE;
DROP POLICY IF EXISTS "Super admins can view all user restaurant associations" ON public.user_restaurants CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all user restaurant associations" ON public.user_restaurants CASCADE;

-- Criar funções security definer para evitar recursão
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

-- Desabilitar RLS na tabela user_roles para evitar recursão
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Recriar políticas usando as funções security definer

-- Políticas para profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_super_admin());

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Super admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_super_admin());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para restaurants
CREATE POLICY "Users can view their associated restaurants"
  ON public.restaurants
  FOR SELECT
  USING (
    public.is_super_admin() OR
    id IN (
      SELECT restaurant_id FROM public.user_restaurants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all restaurants"
  ON public.restaurants
  FOR ALL
  USING (public.is_super_admin());

-- Políticas para user_restaurants
CREATE POLICY "Users can view their own associations"
  ON public.user_restaurants
  FOR SELECT
  USING (
    public.is_super_admin() OR
    user_id = auth.uid()
  );

CREATE POLICY "Super admins can manage all associations"
  ON public.user_restaurants
  FOR ALL
  USING (public.is_super_admin());

-- Admins podem inserir associações
CREATE POLICY "Admins can insert associations"
  ON public.user_restaurants
  FOR INSERT
  WITH CHECK (public.is_admin_or_super());

-- Admins podem atualizar associações
CREATE POLICY "Admins can update associations"
  ON public.user_restaurants
  FOR UPDATE
  USING (public.is_admin_or_super());

-- Admins podem deletar associações
CREATE POLICY "Admins can delete associations"
  ON public.user_restaurants
  FOR DELETE
  USING (public.is_admin_or_super());
