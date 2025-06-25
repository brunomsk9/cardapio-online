
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClose: () => void;
  totalPrice: number;
  onCheckout: () => void;
}

const Cart = ({ cart, onUpdateQuantity, onClose, totalPrice, onCheckout }: CartProps) => {
  // Se o carrinho estiver vazio, não mostrar o modal
  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Carrinho
            <Badge className="ml-2">{cart.length}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-96">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <img
                  src={item.image_url || ''}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-green-600 font-bold">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-semibold">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              R$ {totalPrice.toFixed(2)}
            </span>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            onClick={onCheckout}
          >
            Finalizar Pedido
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Cart;
