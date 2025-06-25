
-- Adicionar campo subdomain à tabela restaurants
ALTER TABLE restaurants ADD COLUMN subdomain VARCHAR(50) UNIQUE;

-- Adicionar índice para melhor performance
CREATE INDEX idx_restaurants_subdomain ON restaurants(subdomain);

-- Comentário para documentar o campo
COMMENT ON COLUMN restaurants.subdomain IS 'Subdomínio único do restaurante (ex: restaurante para restaurante.koombo.online)';
