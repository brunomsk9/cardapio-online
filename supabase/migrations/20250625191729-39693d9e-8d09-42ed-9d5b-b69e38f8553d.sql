
-- Habilitar RLS na tabela orders se não estiver habilitada
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;  
DROP POLICY IF EXISTS "Kitchen can view orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Kitchen can update order status" ON public.orders;

-- Política para permitir que usuários vejam seus próprios pedidos
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Política para permitir que usuários autenticados criem pedidos
CREATE POLICY "Authenticated users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL OR
    auth.uid() IS NOT NULL
  );

-- Política para permitir que usuários não autenticados (convidados) criem pedidos
CREATE POLICY "Guest users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Políticas para administradores verem todos os pedidos
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Políticas para cozinha verem pedidos
CREATE POLICY "Kitchen can view orders"
  ON public.orders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'kitchen'));

-- Políticas para administradores atualizarem pedidos
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Políticas para cozinha atualizar status dos pedidos
CREATE POLICY "Kitchen can update order status"
  ON public.orders
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'kitchen') AND 
    status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered')
  );
