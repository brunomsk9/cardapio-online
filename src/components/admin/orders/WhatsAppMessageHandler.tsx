
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Order = Database['public']['Tables']['orders']['Row'];
type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export const useWhatsAppMessageHandler = (selectedRestaurant: Restaurant | null) => {
  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      pix: 'PIX',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      cash: 'Dinheiro',
      whatsapp: 'WhatsApp'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const sendOrderToCustomer = (order: Order) => {
    const restaurantName = selectedRestaurant?.name || 'Sabor & Arte';
    const cleanPhone = order.customer_phone.replace(/\D/g, '');
    
    // Use the restaurant's custom WhatsApp message or fallback to default
    let message = selectedRestaurant?.whatsapp_message || `🍽️ *NOVO PEDIDO - {restaurant_name}*

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

Obrigado pela preferência! 🙏`;

    // Replace placeholders with actual order data
    message = message
      .replace('{restaurant_name}', restaurantName)
      .replace('{order_id}', order.id)
      .replace('{customer_name}', order.customer_name)
      .replace('{customer_phone}', order.customer_phone)
      .replace('{customer_email}', order.customer_email || '')
      .replace('{delivery_address}', order.delivery_address)
      .replace('{total}', order.total.toFixed(2))
      .replace('{payment_method}', getPaymentMethodLabel(order.payment_method));
    
    // Replace order items
    let itemsText = '';
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        itemsText += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      });
    }
    message = message.replace('{order_items}', itemsText);
    
    // Replace notes
    const notesText = order.notes ? `📝 *Observações:* ${order.notes}` : '';
    message = message.replace('{notes}', notesText);

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto!",
      description: `Mensagem preparada para ${order.customer_name}`,
    });
  };

  return { sendOrderToCustomer };
};
