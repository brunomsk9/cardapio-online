
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, CheckCircle, Utensils, Play, Ban } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

const OrderCard = ({ order, onStatusUpdate }: OrderCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
      preparing: { label: 'Preparando', color: 'bg-orange-100 text-orange-800' },
      ready: { label: 'Pronto', color: 'bg-green-100 text-green-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  const getActionButtons = () => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onStatusUpdate(order.id, 'confirmed')}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Confirmar
            </Button>
            <Button
              onClick={() => onStatusUpdate(order.id, 'cancelled')}
              variant="destructive"
              size="sm"
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        );
      
      case 'confirmed':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onStatusUpdate(order.id, 'preparing')}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              size="sm"
            >
              <Utensils className="h-4 w-4 mr-2" />
              Iniciar Preparo
            </Button>
            <Button
              onClick={() => onStatusUpdate(order.id, 'cancelled')}
              variant="destructive"
              size="sm"
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        );
      
      case 'preparing':
        return (
          <Button
            onClick={() => onStatusUpdate(order.id, 'ready')}
            className="w-full bg-green-500 hover:bg-green-600"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como Pronto
          </Button>
        );
      
      case 'ready':
        return (
          <Button
            onClick={() => onStatusUpdate(order.id, 'delivered')}
            className="w-full bg-gray-500 hover:bg-gray-600"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como Entregue
          </Button>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            #{order.id.slice(0, 8)}
          </CardTitle>
          {getStatusBadge(order.status)}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {order.customer_name}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {getTimeElapsed(order.created_at)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Itens do Pedido:</h4>
          <div className="space-y-2">
            {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <span className="font-medium">{item.quantity}x</span>
                  <span className="ml-2">{item.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-right">
            <span className="font-bold text-lg">
              Total: R$ {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {order.notes && (
          <div>
            <h4 className="font-medium mb-1">Observações:</h4>
            <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
              {order.notes}
            </p>
          </div>
        )}

        <div className="pt-2">
          {getActionButtons()}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
