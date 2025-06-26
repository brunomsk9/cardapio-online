
-- Criar uma view para relatórios de pedidos por período
CREATE OR REPLACE VIEW order_reports AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  restaurant_id,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  AVG(total) as average_order_value,
  COUNT(DISTINCT customer_email) as unique_customers,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
FROM orders
GROUP BY DATE_TRUNC('day', created_at), restaurant_id
ORDER BY date DESC;

-- Criar uma view para relatórios de clientes
CREATE OR REPLACE VIEW customer_reports AS
SELECT 
  customer_email,
  customer_name,
  customer_phone,
  restaurant_id,
  COUNT(*) as total_orders,
  SUM(total) as total_spent,
  AVG(total) as average_order_value,
  MIN(created_at) as first_order_date,
  MAX(created_at) as last_order_date,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders
FROM orders
WHERE customer_email IS NOT NULL
GROUP BY customer_email, customer_name, customer_phone, restaurant_id
ORDER BY total_spent DESC;

-- Criar políticas RLS para as views (herdam das tabelas base)
ALTER VIEW order_reports SET (security_invoker = true);
ALTER VIEW customer_reports SET (security_invoker = true);
