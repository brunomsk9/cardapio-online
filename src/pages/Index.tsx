import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import Cart from '@/components/Cart';
import CategoryFilter from '@/components/CategoryFilter';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import AuthModal from '@/components/auth/AuthModal';
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

  // Título e descrição baseados no contexto
  const pageTitle = restaurant ? restaurant.name : 'Koombo';
  const pageDescription = restaurant 
    ? (restaurant.description || `Descubra os deliciosos pratos do ${restaurant.name}`)
    : 'Pedidos & Gestão - Descubra os melhores sabores da nossa cozinha.';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
        onAdminClick={handleAdminToggle}
        user={user}
        onSignOut={handleSignOut}
        isAdmin={isAdmin}
        isKitchen={isKitchen}
      />

      <section className="bg-orange-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-orange-700 mb-4">
            Bem-vindo ao {pageTitle}!
          </h2>
          <p className="text-lg text-gray-700">
            {pageDescription}
          </p>
        </div>
      </section>

      <section className="container mx-auto mt-8">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={() => addToCart(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {restaurant 
                ? `${restaurant.name} ainda não possui itens no cardápio.`
                : 'Nenhum item encontrado nesta categoria.'
              }
            </p>
          </div>
        )}
      </section>

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
