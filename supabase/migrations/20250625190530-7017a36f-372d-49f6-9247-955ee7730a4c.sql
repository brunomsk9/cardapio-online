
-- Remover o trigger que está causando o problema de duplicação
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover também o trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;

-- Manter apenas a função para possível uso futuro, mas sem o trigger automático
-- A função handle_new_user permanece disponível caso seja necessária posteriormente
