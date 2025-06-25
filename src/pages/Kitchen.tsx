import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Clock, User, CheckCircle, XCircle, Utensils } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

const Kitchen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isKitchen, loading: roleLoading } = useUserRole();

  console.log('Kitchen page - Auth state:', { user: user?.id, authLoading, isAdmin, isKitchen, roleLoading });

  useEffect(() => {
    console.log('Kitchen useEffect triggered:', { authLoading, roleLoading, user: !!user, isAdmin, isKitchen });
    
    if (!authLoading && !roleLoading) {
      if (!user) {
        console.log('No user, redirecting to home');
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar a cozinha.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!isAdmin && !isKitchen) {
        console.log('User is neither admin nor kitchen, redirecting to home');
        toast({
          title: "Acesso negado",
          description: "Apenas administradores e funcionários da cozinha podem acessar esta página.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      console.log('User has kitchen or admin access, loading orders');
      fetchOrders();
      setupRealtimeSubscription();
    }
  }, [user, isAdmin, isKitchen, authLoading, roleLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['confirmed', 'preparing'])
        .order('created_at', { ascending: true });

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

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('kitchen-orders')
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
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Pedido marcado como ${newStatus === 'preparing' ? 'em preparo' : 'pronto'}.`,
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
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
      preparing: { label: 'Preparando', color: 'bg-orange-100 text-orange-800' },
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

  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render kitchen if user doesn't have access
  if (!user || (!isAdmin && !isKitchen)) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Utensils className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Cozinha - Sabor & Arte</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Pedidos Ativos</h2>
          <p className="text-gray-600">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} em preparo ou aguardando
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-l-4 border-l-orange-500">
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
                </div>

                {order.notes && (
                  <div>
                    <h4 className="font-medium mb-1">Observações:</h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                      {order.notes}
                    </p>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  {order.status === 'confirmed' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Utensils className="h-4 w-4 mr-2" />
                      Iniciar Preparo
                    </Button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Pronto
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum pedido ativo
            </h3>
            <p className="text-gray-500">
              Todos os pedidos foram preparados ou não há novos pedidos.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Kitchen;
