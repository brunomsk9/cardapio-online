
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Building2, MessageSquare } from 'lucide-react';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import RestaurantInfoForm from './settings/RestaurantInfoForm';
import WhatsAppMessageForm from './settings/WhatsAppMessageForm';

const RestaurantSettings = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    whatsapp_message: ''
  });
  const [saving, setSaving] = useState(false);

  const defaultWhatsAppMessage = `🍽️ *NOVO PEDIDO - {restaurant_name}*

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

  useEffect(() => {
    if (selectedRestaurant) {
      setFormData({
        name: selectedRestaurant.name || '',
        description: selectedRestaurant.description || '',
        address: selectedRestaurant.address || '',
        phone: selectedRestaurant.phone || '',
        email: selectedRestaurant.email || '',
        whatsapp_message: selectedRestaurant.whatsapp_message || defaultWhatsAppMessage
      });
    }
  }, [selectedRestaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRestaurant) {
      toast({
        title: "Erro",
        description: "Nenhum restaurante selecionado.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          whatsapp_message: formData.whatsapp_message,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRestaurant.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Configurações salvas!",
        description: "As informações do restaurante foram atualizadas com sucesso.",
      });

      // Atualizar o restaurante selecionado localmente
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating restaurant:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetWhatsAppMessage = () => {
    setFormData(prev => ({ ...prev, whatsapp_message: defaultWhatsAppMessage }));
  };

  if (!selectedRestaurant) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Selecione um restaurante para gerenciar suas configurações.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Configurações do Restaurante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantInfoForm
            formData={formData}
            saving={saving}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mensagem Padrão do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WhatsAppMessageForm
            whatsappMessage={formData.whatsapp_message}
            saving={saving}
            onMessageChange={(value) => handleInputChange('whatsapp_message', value)}
            onResetMessage={resetWhatsAppMessage}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantSettings;
