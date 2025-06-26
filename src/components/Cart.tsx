
import { X, Minus, Plus, ShoppingBag, MapPin, Clock } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden bg-gray-900 border-gray-700 text-white">
        {/* Header */}
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-gray-700 p-2"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-koombo-laranja">KOOMBO</h2>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>Hoje 12:07 AM</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Delivery time</p>
              <Badge className="bg-koombo-laranja text-white">
                <MapPin className="h-3 w-3 mr-1" />
                Entrega: 30-45 min
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        {/* Items List */}
        <CardContent className="overflow-y-auto max-h-96 bg-gray-900 p-0">
          <div className="space-y-1">
            {cart.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                {/* Quantity Badge */}
                <div className="flex flex-col items-center gap-2">
                  <Badge className="bg-koombo-laranja text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </Badge>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0 border-gray-600 text-white hover:bg-koombo-laranja hover:border-koombo-laranja"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0 border-gray-600 text-white hover:bg-red-500 hover:border-red-500"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  <img
                    src={item.image_url || '/placeholder.svg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {item.description?.substring(0, 50)}...
                  </p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-koombo-laranja font-bold text-lg">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-gray-400 text-sm">
                      R$ {item.price.toFixed(2).replace('.', ',')} cada
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        {/* Footer with Total and Checkout */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-300 text-sm">Total do pedido</p>
              <p className="text-2xl font-bold text-koombo-laranja">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">{cart.length} itens</p>
              <p className="text-gray-400 text-xs">Taxa de entrega: Grátis</p>
            </div>
          </div>
          
          <Button 
            className="w-full bg-koombo-laranja hover:bg-koombo-laranja/90 text-white font-semibold py-4 text-lg rounded-xl"
            onClick={onCheckout}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Finalizar Pedido
          </Button>
          
          <p className="text-center text-gray-400 text-xs mt-2">
            Tempo estimado de entrega: 30-45 minutos
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Cart;
