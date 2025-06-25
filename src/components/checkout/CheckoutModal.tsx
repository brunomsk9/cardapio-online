
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CartItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  user: User | null;
  onClearCart: () => void;
}

const CheckoutModal = ({ isOpen, onClose, cart, totalPrice, user, onClearCart }: CheckoutModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerEmail(user.email || '');
      // Buscar dados do perfil do usuário
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setCustomerName(data.full_name || '');
        setCustomerPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        user_id: user?.id || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        delivery_address: deliveryAddress,
        items: JSON.parse(JSON.stringify(cart)), // Convert CartItem[] to Json
        total: totalPrice,
        notes: notes || null,
        status: 'pending',
        payment_method: paymentMethod
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Pedido criado com sucesso!",
        description: `Redirecionando para ${getPaymentMethodLabel(paymentMethod)}...`,
      });

      // Redirecionar baseado no método de pagamento
      if (paymentMethod === 'whatsapp' || paymentMethod === 'pix') {
        redirectToWhatsApp(data, cart, totalPrice);
      } else {
        // Para cartão de crédito, poderia integrar com gateway de pagamento
        toast({
          title: "Método de pagamento selecionado",
          description: "Pedido será processado na entrega.",
        });
      }
      
      onClearCart();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao criar pedido",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const redirectToWhatsApp = (order: any, items: CartItem[], total: number) => {
    const phoneNumber = "5511999999999"; // Substitua pelo seu número do WhatsApp
    
    let message = `🍽️ *NOVO PEDIDO - Sabor & Arte*\n\n`;
    message += `📋 *Pedido:* ${order.id}\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📱 *Telefone:* ${customerPhone}\n`;
    message += `📧 *Email:* ${customerEmail}\n`;
    message += `📍 *Endereço:* ${deliveryAddress}\n\n`;
    
    message += `🛒 *Itens do Pedido:*\n`;
    items.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n💰 *Total: R$ ${total.toFixed(2)}*\n`;
    
    if (notes) {
      message += `\n📝 *Observações:* ${notes}\n`;
    }
    
    message += `\n💳 *Forma de Pagamento:* ${getPaymentMethodLabel(paymentMethod)}\n`;
    message += `\nObrigado pela preferência! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Endereço de Entrega</Label>
            <Textarea
              id="address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade, CEP"
              required
            />
          </div>

          <div>
            <Label>Forma de Pagamento</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center cursor-pointer">
                  <Smartphone className="h-4 w-4 mr-2 text-green-600" />
                  PIX (Instantâneo)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                  Cartão de Crédito
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="debit_card" id="debit_card" />
                <Label htmlFor="debit_card" className="flex items-center cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
                  Cartão de Débito
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <DollarSign className="h-4 w-4 mr-2 text-yellow-600" />
                  Dinheiro (Na entrega)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruções especiais para entrega, preferências, etc."
            />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
