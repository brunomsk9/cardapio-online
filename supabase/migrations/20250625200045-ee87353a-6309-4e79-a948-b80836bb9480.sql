
-- Add whatsapp_message column to restaurants table
ALTER TABLE public.restaurants 
ADD COLUMN whatsapp_message TEXT;

-- Set a default WhatsApp message for existing restaurants
UPDATE public.restaurants 
SET whatsapp_message = '🍽️ *NOVO PEDIDO - {restaurant_name}*

📋 *Pedido:* {order_id}
👤 *Cliente:* {customer_name}
📱 *Telefone:* {customer_phone}
📧 *Email:* {customer_email}
📍 *Endereço:* {delivery_address}

🛒 *Itens do Pedido:*
{order_items}

💰 *Total: R$ {total}*

💳 *Forma de Pagamento:* {payment_method}

{notes}

Obrigado pela preferência! 🙏'
WHERE whatsapp_message IS NULL;
