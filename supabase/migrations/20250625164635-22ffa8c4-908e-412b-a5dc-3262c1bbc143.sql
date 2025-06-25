
-- 1. Remover todas as políticas RLS existentes que estão causando problemas
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Super admins can update all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles CASCADE;

DROP POLICY IF EXISTS "Users can view their associated restaurants" ON public.restaurants CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all restaurants" ON public.restaurants CASCADE;

DROP POLICY IF EXISTS "Users can view their own associations" ON public.user_restaurants CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all associations" ON public.user_restaurants CASCADE;
DROP POLICY IF EXISTS "Admins can insert associations" ON public.user_restaurants CASCADE;
DROP POLICY IF EXISTS "Admins can update associations" ON public.user_restaurants CASCADE;
DROP POLICY IF EXISTS "Admins can delete associations" ON public.user_restaurants CASCADE;

DROP POLICY IF EXISTS "Public can view available menu items" ON public.menu_items CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all menu items" ON public.menu_items CASCADE;
DROP POLICY IF EXISTS "Admins can manage their restaurant menu items" ON public.menu_items CASCADE;

-- 2. Limpar usuários, mantendo apenas o super admin
DO $$
DECLARE
    super_admin_id UUID;
BEGIN
    -- Encontrar o ID do super admin
    SELECT user_id INTO super_admin_id 
    FROM public.user_roles 
    WHERE role = 'super_admin' 
    LIMIT 1;
    
    -- Se existe super admin, remover todos os outros usuários
    IF super_admin_id IS NOT NULL THEN
        -- Remover associações de restaurantes dos outros usuários
        DELETE FROM public.user_restaurants WHERE user_id != super_admin_id;
        
        -- Remover roles dos outros usuários
        DELETE FROM public.user_roles WHERE user_id != super_admin_id;
        
        -- Remover perfis dos outros usuários
        DELETE FROM public.profiles WHERE id != super_admin_id;
    END IF;
END $$;

-- 3. Recriar políticas RLS simplificadas e funcionais

-- Políticas para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admins view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_super_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Super admins update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_super_admin());

CREATE POLICY "Super admins insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (public.is_super_admin());

-- Políticas para restaurants
CREATE POLICY "Super admins manage all restaurants"
  ON public.restaurants
  FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Users view associated restaurants"
  ON public.restaurants
  FOR SELECT
  USING (
    public.is_super_admin() OR
    id IN (
      SELECT restaurant_id FROM public.user_restaurants 
      WHERE user_id = auth.uid()
    )
  );

-- Políticas para user_restaurants
CREATE POLICY "Super admins manage all user restaurants"
  ON public.user_restaurants
  FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Users view own associations"
  ON public.user_restaurants
  FOR SELECT
  USING (
    public.is_super_admin() OR
    user_id = auth.uid()
  );

-- Políticas para menu_items
CREATE POLICY "Public view available menu items"
  ON public.menu_items
  FOR SELECT
  USING (available = true);

CREATE POLICY "Super admins manage all menu items"
  ON public.menu_items
  FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Restaurant managers manage their menu items"
  ON public.menu_items
  FOR ALL
  USING (
    public.is_admin_or_super() AND
    restaurant_id IN (
      SELECT restaurant_id FROM public.user_restaurants 
      WHERE user_id = auth.uid()
    )
  );

-- 4. Garantir que pelo menos um restaurante existe para testes
INSERT INTO public.restaurants (name, description, is_active)
VALUES ('Restaurante Exemplo', 'Restaurante para testes do sistema', true)
ON CONFLICT DO NOTHING;

-- 5. Criar alguns itens de menu de exemplo se não existirem
DO $$
DECLARE
    target_restaurant_id UUID;
BEGIN
    -- Pegar o primeiro restaurante ativo
    SELECT id INTO target_restaurant_id FROM public.restaurants WHERE is_active = true LIMIT 1;
    
    IF target_restaurant_id IS NOT NULL THEN
        -- Verificar se já existem itens de menu para este restaurante
        IF NOT EXISTS (SELECT 1 FROM public.menu_items WHERE menu_items.restaurant_id = target_restaurant_id) THEN
            -- Inserir itens de menu de exemplo
            INSERT INTO public.menu_items (restaurant_id, name, description, price, category, available)
            VALUES 
                (target_restaurant_id, 'Hambúrguer Clássico', 'Hambúrguer com carne, queijo, alface e tomate', 15.90, 'principal', true),
                (target_restaurant_id, 'Refrigerante', 'Coca-Cola 350ml', 4.50, 'bebida', true),
                (target_restaurant_id, 'Batata Frita', 'Porção de batata frita crocante', 8.90, 'entrada', true);
        END IF;
    END IF;
END $$;
