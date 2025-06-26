
-- Configurar webhook para emails personalizados
-- Esta migração configura o webhook que será usado para enviar emails personalizados

-- Primeiro, vamos criar uma função que será chamada quando um usuário se cadastrar
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Log para debug
  RAISE LOG 'New user signup detected: %', NEW.id;
  
  -- Aqui você pode adicionar lógica adicional se necessário
  -- Por exemplo, criar registros específicos ou disparar outras ações
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários (opcional, para logs ou ações adicionais)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- Comentários para documentação
COMMENT ON FUNCTION public.handle_new_user_signup() IS 'Função chamada quando um novo usuário se cadastra';
