
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainDomainPage from '@/components/MainDomainPage';
import RestaurantPage from '@/components/RestaurantPage';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSubdomainRestaurant } from '@/hooks/useSubdomainRestaurant';
import { useRestaurantMenu } from '@/hooks/useRestaurantMenu';
import { mockMenuItems } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, isKitchen, loading: roleLoading } = useUserRole();
  const { restaurant, loading: restaurantLoading, error: restaurantError, isMainDomain } = useSubdomainRestaurant();
  const { menuItems: restaurantMenuItems, loading: menuLoading } = useRestaurantMenu(restaurant);
  const navigate = useNavigate();

  const {
    cart,
    addToCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCart();

  console.log('Index component - isMainDomain:', isMainDomain);

  const handleAdminToggle = () => {
    if (authLoading || roleLoading) {
      toast({
        title: "Aguarde",
        description: "Carregando informações do usuário...",
      });
      return;
    }
    
    if (user && isAdmin) {
      navigate('/admin');
    } else if (user && !isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o painel administrativo.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até mais!",
      });
    }
  };

  const handleAuthSuccess = () => {
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo!",
    });
  };

  // Mostrar loading se estiver carregando dados críticos
  if (authLoading || restaurantLoading || (restaurant && menuLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver problema ao carregar restaurante
  if (restaurantError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurante não encontrado</h2>
          <p className="text-gray-600 mb-4">{restaurantError.message}</p>
          <p className="text-sm text-gray-500">
            Verifique se o endereço está correto ou entre em contato conosco.
          </p>
        </div>
      </div>
    );
  }

  // Determinar quais itens do menu usar
  const menuItems = isMainDomain ? mockMenuItems : restaurantMenuItems;

  // Se for o domínio principal, mostrar a página de apresentação do produto
  if (isMainDomain) {
    return (
      <MainDomainPage
        user={user}
        isAdmin={isAdmin}
        isKitchen={isKitchen}
        onAdminClick={handleAdminToggle}
        onSignOut={handleSignOut}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <RestaurantPage
      restaurant={restaurant}
      menuItems={menuItems}
      user={user}
      isAdmin={isAdmin}
      isKitchen={isKitchen}
      cart={cart}
      onAdminClick={handleAdminToggle}
      onSignOut={handleSignOut}
      onAuthSuccess={handleAuthSuccess}
      onAddToCart={addToCart}
      onUpdateQuantity={updateQuantity}
      getTotalPrice={getTotalPrice}
      getTotalItems={getTotalItems}
      onClearCart={clearCart}
    />
  );
};

export default Index;
