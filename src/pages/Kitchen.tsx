
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useKitchenOrders } from '@/hooks/useKitchenOrders';
import NotificationManager from '@/components/NotificationManager';
import KitchenHeader from '@/components/kitchen/KitchenHeader';
import OrdersStats from '@/components/kitchen/OrdersStats';
import OrdersList from '@/components/kitchen/OrdersList';
import LoadingSpinner from '@/components/kitchen/LoadingSpinner';
import { useOrderNotificationSound } from '@/hooks/useOrderNotificationSound';

const Kitchen = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isKitchen, isSuperAdmin, loading: roleLoading } = useUserRole();
  const { orders, loading: ordersLoading, updateOrderStatus } = useKitchenOrders();
  
  // Enable order notification sound
  useOrderNotificationSound(true);

  console.log('Kitchen page - Auth state:', { 
    user: user?.id, 
    authLoading, 
    isAdmin, 
    isKitchen, 
    isSuperAdmin, 
    roleLoading 
  });

  useEffect(() => {
    console.log('Kitchen useEffect triggered:', { 
      authLoading, 
      roleLoading, 
      user: !!user, 
      isAdmin, 
      isKitchen, 
      isSuperAdmin 
    });
    
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

      // Admins, super admins e kitchen têm acesso à cozinha
      if (!isAdmin && !isKitchen && !isSuperAdmin) {
        console.log('User does not have kitchen access, redirecting to home');
        toast({
          title: "Acesso negado",
          description: "Apenas administradores e funcionários da cozinha podem acessar esta página.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      console.log('User has kitchen access, loading orders');
    }
  }, [user, isAdmin, isKitchen, isSuperAdmin, authLoading, roleLoading, navigate]);

  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    return <LoadingSpinner message="Carregando..." />;
  }

  // Don't render kitchen if user doesn't have access
  if (!user || (!isAdmin && !isKitchen && !isSuperAdmin)) {
    return null;
  }

  if (ordersLoading) {
    return <LoadingSpinner message="Carregando pedidos..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationManager />
      <KitchenHeader />
      
      <main className="container mx-auto px-4 py-8">
        <OrdersStats ordersCount={orders.length} />
        <OrdersList orders={orders} onStatusUpdate={updateOrderStatus} />
      </main>
    </div>
  );
};

export default Kitchen;
