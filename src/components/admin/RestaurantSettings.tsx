
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Save, Building2, MessageSquare } from 'lucide-react';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';

const RestaurantSettings = () => {
  const { selectedRestaurant, restaurants } = useUserRestaurant();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    whatsapp_message: ''
  });
  const [loading, setLoading] = useState(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Restaurante *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome do restaurante"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contato@restaurante.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição do restaurante"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Endereço completo do restaurante"
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mensagem Padrão do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp_message">Modelo da Mensagem</Label>
            <Textarea
              id="whatsapp_message"
              value={formData.whatsapp_message}
              onChange={(e) => handleInputChange('whatsapp_message', e.target.value)}
              placeholder="Digite sua mensagem personalizada..."
              rows={15}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Variáveis Disponíveis:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
              <div><code>{'{restaurant_name}'}</code> - Nome do restaurante</div>
              <div><code>{'{order_id}'}</code> - ID do pedido</div>
              <div><code>{'{customer_name}'}</code> - Nome do cliente</div>
              <div><code>{'{customer_phone}'}</code> - Telefone do cliente</div>
              <div><code>{'{customer_email}'}</code> - Email do cliente</div>
              <div><code>{'{delivery_address}'}</code> - Endereço de entrega</div>
              <div><code>{'{order_items}'}</code> - Lista de itens do pedido</div>
              <div><code>{'{total}'}</code> - Valor total</div>
              <div><code>{'{payment_method}'}</code> - Forma de pagamento</div>
              <div><code>{'{notes}'}</code> - Observações (se houver)</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetWhatsAppMessage}
              className="flex items-center gap-2"
            >
              Restaurar Padrão
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar Mensagem'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantSettings;
