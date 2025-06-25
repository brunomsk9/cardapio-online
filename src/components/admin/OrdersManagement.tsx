import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Clock, Phone, MapPin, User, DollarSign } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';

type Order = Database['public']['Tables']['orders']['Row'];

const OrdersManagement = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [selectedRestaurant]);

  const fetchOrders = async () => {
    if (!selectedRestaurant) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      // Por enquanto, buscamos todos os pedidos já que não temos ainda o campo restaurant_id
      // TODO: Adicionar filtro por restaurant_id quando o campo for adicionado à tabela orders
      const { data, error } = await supabase
        .from('orders')
        .select('*')
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status atualizado!",
        description: "O status do pedido foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (!selectedRestaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Selecione um restaurante para visualizar os pedidos.
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Gerenciar Pedidos</h3>
          <p className="text-sm text-gray-600 mt-1">Restaurante: {selectedRestaurant.name}</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pedidos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="preparing">Preparando</SelectItem>
            <SelectItem value="ready">Prontos</SelectItem>
            <SelectItem value="delivered">Entregues</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
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
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.notes && (
                <div>
                  <h4 className="font-medium mb-1">Observações:</h4>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Select
                  value={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="preparing">Preparando</SelectItem>
                    <SelectItem value="ready">Pronto</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum pedido encontrado para este restaurante.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
