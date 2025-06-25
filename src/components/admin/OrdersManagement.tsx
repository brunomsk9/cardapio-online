
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import OrdersFilter from './orders/OrdersFilter';
import OrdersList from './orders/OrdersList';
import { useWhatsAppMessageHandler } from './orders/WhatsAppMessageHandler';

type Order = Database['public']['Tables']['orders']['Row'];

const OrdersManagement = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { sendOrderToCustomer } = useWhatsAppMessageHandler(selectedRestaurant);

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

      const getStatusLabel = (status: string) => {
        const statusLabels = {
          pending: 'Pendente',
          confirmed: 'Confirmado',
          preparing: 'Preparando',
          ready: 'Pronto',
          delivered: 'Entregue',
          cancelled: 'Cancelado'
        };
        return statusLabels[status as keyof typeof statusLabels] || status;
      };

      toast({
        title: "Status atualizado!",
        description: `Pedido marcado como: ${getStatusLabel(newStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
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
        <OrdersFilter 
          statusFilter={statusFilter} 
          onFilterChange={setStatusFilter} 
        />
      </div>

      <OrdersList
        orders={filteredOrders}
        onStatusUpdate={updateOrderStatus}
        onSendToCustomer={sendOrderToCustomer}
      />
    </div>
  );
};

export default OrdersManagement;
