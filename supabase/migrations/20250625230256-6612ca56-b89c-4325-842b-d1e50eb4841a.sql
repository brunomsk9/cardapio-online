
-- Adicionar coluna restaurant_id na tabela orders
ALTER TABLE public.orders 
ADD COLUMN restaurant_id uuid REFERENCES public.restaurants(id);

-- Criar índice para melhorar performance nas consultas por restaurante
CREATE INDEX idx_orders_restaurant_id ON public.orders(restaurant_id);

-- Atualizar as políticas RLS existentes para incluir verificação por restaurante
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Kitchen can view orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Kitchen can update order status" ON public.orders;

-- Política para administradores verem pedidos dos seus restaurantes
CREATE POLICY "Admins can view restaurant orders"
  ON public.orders
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'super_admin') OR
    (restaurant_id IS NULL AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')))
  );

-- Política para cozinha ver pedidos do restaurante associado
CREATE POLICY "Kitchen can view restaurant orders"
  ON public.orders
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'kitchen') AND
    (restaurant_id IS NULL OR 
     restaurant_id IN (
       SELECT ur.restaurant_id 
       FROM user_restaurants ur 
       WHERE ur.user_id = auth.uid()
     ))
  );

-- Política para administradores atualizarem pedidos dos seus restaurantes
CREATE POLICY "Admins can update restaurant orders"
  ON public.orders
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'super_admin') OR
    (restaurant_id IS NULL AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')))
  );

-- Política para cozinha atualizar status dos pedidos do restaurante associado
CREATE POLICY "Kitchen can update restaurant order status"
  ON public.orders
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'kitchen') AND
    (restaurant_id IS NULL OR 
     restaurant_id IN (
       SELECT ur.restaurant_id 
       FROM user_restaurants ur 
       WHERE ur.user_id = auth.uid()
     )) AND
    status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered')
  );
