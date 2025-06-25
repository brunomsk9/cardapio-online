
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/index';
import { useSubdomainRestaurant } from '@/hooks/useSubdomainRestaurant';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  user: any;
  onClearCart: () => void;
}

const CheckoutModal = ({ isOpen, onClose, cart, totalPrice, user, onClearCart }: CheckoutModalProps) => {
  const { restaurant } = useSubdomainRestaurant();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerEmail(user.email || '');
    }
  }, [user]);

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        notes: notes || null,
        items: cart,
        total: totalPrice,
        user_id: user?.id || null,
        restaurant_id: restaurant?.id || null,
        status: 'pending'
      };

      console.log('Creating order with data:', orderData);

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }

      console.log('Order created successfully:', data);

      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido foi enviado. Total: R$ ${totalPrice.toFixed(2)}`,
      });

      onClearCart();
      onClose();
      
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setDeliveryAddress('');
      setPaymentMethod('pix');
      setNotes('');
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast({
        title: "Erro ao fazer pedido",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Pedido */}
          <div>
            <h3 className="font-semibold mb-3">Resumo do Pedido</h3>
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            {restaurant && (
              <p className="text-sm text-gray-600 mt-2">
                Restaurante: {restaurant.name}
              </p>
            )}
          </div>

          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dados do Cliente</h3>
            
            <div>
              <Label htmlFor="customerName">Nome *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">Telefone *</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="customerEmail">E-mail</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div>
            <Label htmlFor="deliveryAddress">Endereço de Entrega *</Label>
            <Textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              rows={3}
            />
          </div>

          {/* Método de Pagamento */}
          <div>
            <Label>Método de Pagamento</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix">PIX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dinheiro" id="dinheiro" />
                <Label htmlFor="dinheiro">Dinheiro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cartao" id="cartao" />
                <Label htmlFor="cartao">Cartão (na entrega)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alguma observação especial para o pedido?"
              rows={2}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
