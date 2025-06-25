
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { useUserRestaurant } from './useUserRestaurant';

type Order = Database['public']['Tables']['orders']['Row'];

export const useKitchenOrders = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!selectedRestaurant) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching kitchen orders for restaurant:', selectedRestaurant.name);
      
      let query = supabase
        .from('orders')
        .select('*')
        .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });

      // Filter by restaurant_id or include orders without restaurant_id (legacy orders)
      query = query.or(`restaurant_id.eq.${selectedRestaurant.id},restaurant_id.is.null`);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log(`Loaded ${data?.length || 0} kitchen orders for restaurant ${selectedRestaurant.name}`);
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching kitchen orders:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedRestaurant]);

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

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
