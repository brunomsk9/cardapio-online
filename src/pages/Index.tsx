
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import AuthModal from '@/components/auth/AuthModal';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSubdomainRestaurant } from '@/hooks/useSubdomainRestaurant';
import { useRestaurantMenu } from '@/hooks/useRestaurantMenu';
import { mockMenuItems } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, isKitchen, loading: roleLoading } = useUserRole();
  const { restaurant, loading: restaurantLoading, error: restaurantError, isMainDomain } = useSubdomainRestaurant();
  const { menuItems: restaurantMenuItems, loading: menuLoading } = useRestaurantMenu(restaurant);
  const navigate = useNavigate();

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

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
    } else {
      setShowAuthModal(true);
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
    setShowAuthModal(false);
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo!",
    });
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'entrada', label: 'Entradas' },
    { key: 'principal', label: 'Pratos Principais' },
    { key: 'bebida', label: 'Bebidas' },
    { key: 'sobremesa', label: 'Sobremesas' }
  ];

  // Determinar quais itens do menu usar
  const menuItems = isMainDomain ? mockMenuItems : restaurantMenuItems;

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  // Mostrar loading se estiver carregando dados críticos
  if (authLoading || restaurantLoading || (restaurant && menuLoading)) {
    return <LoadingState />;
  }

  // Mostrar erro se houver problema ao carregar restaurante
  if (restaurantError) {
    return (
      <ErrorState
        title="Restaurante não encontrado"
        message={restaurantError.message}
        subtitle="Verifique se o endereço está correto ou entre em contato conosco."
      />
    );
  }

  // Título e descrição baseados no contexto
  const pageTitle = restaurant ? restaurant.name : 'Koombo';
  const pageDescription = restaurant 
    ? (restaurant.description || `Descubra os deliciosos pratos do ${restaurant.name}`)
    : 'Sistema de Pedidos & Gestão - Descubra os melhores sabores da nossa cozinha.';

  return (
    <div className="min-h-screen bg-koombo-graphite">
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
        onAdminClick={handleAdminToggle}
        user={user}
        onSignOut={handleSignOut}
        isAdmin={isAdmin}
        isKitchen={isKitchen}
      />

      <HeroSection 
        title={pageTitle}
        description={pageDescription}
      />

      <MenuSection
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        menuItems={menuItems}
        filteredItems={filteredItems}
        onAddToCart={addToCart}
        restaurantName={restaurant?.name}
      />

      {showCart && (
        <Cart
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onClose={() => setShowCart(false)}
          totalPrice={getTotalPrice()}
          onCheckout={handleCheckout}
        />
      )}

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        totalPrice={getTotalPrice()}
        user={user}
        onClearCart={clearCart}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
