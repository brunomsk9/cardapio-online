
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Clock, User, CheckCircle2, Package, Utensils, Truck } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';

type Order = Database['public']['Tables']['orders']['Row'];

const OrdersTracking = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Configurar atualização em tempo real
    const channel = supabase
      .channel('orders-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRestaurant]);

  const fetchOrders = async () => {
    if (!selectedRestaurant) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status: string) => {
    const statusMap = {
      pending: { progress: 25, label: 'Pedido Recebido', icon: Package, color: 'bg-yellow-500' },
      confirmed: { progress: 50, label: 'Confirmado', icon: CheckCircle2, color: 'bg-blue-500' },
      preparing: { progress: 75, label: 'Preparando', icon: Utensils, color: 'bg-orange-500' },
      ready: { progress: 100, label: 'Pronto para Entrega', icon: Truck, color: 'bg-green-500' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-800' },
      preparing: { label: 'Preparando', className: 'bg-orange-100 text-orange-800' },
      ready: { label: 'Pronto', className: 'bg-green-100 text-green-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (!selectedRestaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Selecione um restaurante para visualizar o acompanhamento dos pedidos.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Acompanhamento de Pedidos</h3>
        <p className="text-sm text-gray-600 mt-1">
          Restaurante: {selectedRestaurant.name} • {orders.length} pedidos ativos
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Nenhum pedido ativo no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const statusInfo = getStatusProgress(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        Pedido #{order.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-4">{order.customer_name}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{getTimeElapsed(order.created_at)}</span>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Barra de Progresso */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${statusInfo.color} text-white mr-3`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{statusInfo.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">{statusInfo.progress}%</span>
                    </div>
                    <Progress value={statusInfo.progress} className="h-3" />
                  </div>

                  {/* Etapas do Pedido */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { key: 'pending', label: 'Recebido', icon: Package },
                      { key: 'confirmed', label: 'Confirmado', icon: CheckCircle2 },
                      { key: 'preparing', label: 'Preparando', icon: Utensils },
                      { key: 'ready', label: 'Pronto', icon: Truck }
                    ].map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = statusInfo.progress > (index * 25);
                      const isActive = order.status === step.key;
                      
                      return (
                        <div key={step.key} className="text-center">
                          <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            isCompleted || isActive 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          } ${isActive ? 'ring-2 ring-green-500' : ''}`}>
                            <StepIcon className="h-5 w-5" />
                          </div>
                          <p className={`text-xs ${
                            isCompleted || isActive ? 'text-green-600 font-medium' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Resumo do Pedido */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Resumo do Pedido</h4>
                    <div className="space-y-1 text-sm">
                      {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 font-medium flex justify-between">
                        <span>Total</span>
                        <span>R$ {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informações de Entrega */}
                  <div className="text-sm text-gray-600">
                    <p><strong>Entrega:</strong> {order.delivery_address}</p>
                    <p><strong>Telefone:</strong> {order.customer_phone}</p>
                    <p><strong>Pagamento:</strong> {order.payment_method.toUpperCase()}</p>
                    {order.notes && (
                      <p><strong>Observações:</strong> {order.notes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersTracking;
