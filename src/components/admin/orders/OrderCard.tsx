
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Phone, MapPin, User, DollarSign, MessageSquare } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import OrderStatusButtons from './OrderStatusButtons';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
  onSendToCustomer: (order: Order) => void;
}

const OrderCard = ({ order, onStatusUpdate, onSendToCustomer }: OrderCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
      preparing: { label: 'Preparando', color: 'bg-orange-100 text-orange-800' },
      ready: { label: 'Pronto', color: 'bg-green-100 text-green-800' },
      delivered: { label: 'Entregue', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            Pedido #{order.id.slice(0, 8)}
          </CardTitle>
          {getStatusBadge(order.status)}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {new Date(order.created_at).toLocaleString('pt-BR')}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-1" />
              <span className="text-sm">{order.delivery_address}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-bold text-green-600">R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Pagamento: {order.payment_method.toUpperCase()}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Itens do Pedido:</h4>
          <div className="space-y-1">
            {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="text-right font-bold text-lg pt-2 border-t">
              Total: R$ {order.total.toFixed(2)}
            </div>
          </div>
        </div>

        {order.notes && (
          <div>
            <h4 className="font-medium mb-1">Observações:</h4>
            <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">{order.notes}</p>
          </div>
        )}

        <div className="space-y-3">
          <OrderStatusButtons
            currentStatus={order.status}
            onStatusChange={(status) => onStatusUpdate(order.id, status)}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={() => onSendToCustomer(order)}
              variant="outline"
              size="sm"
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar ao Cliente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
