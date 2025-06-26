
-- Criar política para permitir acesso público aos restaurantes ativos
-- Isso é necessário para que a detecção por subdomínio funcione sem autenticação

CREATE POLICY "Public can view active restaurants" 
  ON public.restaurants 
  FOR SELECT 
  USING (is_active = true);
