
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
      
      // Por enquanto, buscamos todos os pedidos já que não temos ainda o campo restaurant_id
      // TODO: Adicionar filtro por restaurant_id quando o campo for adicionado à tabela orders
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
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

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
