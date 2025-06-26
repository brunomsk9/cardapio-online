import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import Cart from '@/components/Cart';
import CategoryFilter from '@/components/CategoryFilter';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import AuthModal from '@/components/auth/AuthModal';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSubdomainRestaurant } from '@/hooks/useSubdomainRestaurant';
import { useRestaurantMenu } from '@/hooks/useRestaurantMenu';
import { mockMenuItems } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Utensils, BarChart3 } from 'lucide-react';

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

  // Helper function to get cart quantity for an item
  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
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

  // Título e descrição baseados no contexto
  const pageTitle = restaurant ? restaurant.name : 'Koombo';
  const pageDescription = restaurant 
    ? (restaurant.description || `Descubra os deliciosos pratos do ${restaurant.name}`)
    : 'Pedidos & Gestão - Descubra os melhores sabores da nossa cozinha.';

  // Se for o domínio principal, mostrar a página de apresentação do produto
  if (isMainDomain) {
    console.log('Rendering main domain page');
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemsCount={0}
          onCartClick={() => {}}
          onAdminClick={handleAdminToggle}
          user={user}
          onSignOut={handleSignOut}
          isAdmin={isAdmin}
          isKitchen={isKitchen}
        />

        {/* Hero Section com Slide Estático */}
        <section className="relative bg-gradient-to-r from-orange-500 to-red-600 py-20 text-white overflow-hidden">
          <div className="relative container mx-auto text-center px-4 z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 max-w-4xl mx-auto border border-white/20">
              <h1 className="text-6xl font-bold mb-6 text-white">
                KOOMBO
              </h1>
              <p className="text-2xl font-light mb-8 text-white/90">
                PEDIDOS & GESTÃO
              </p>
              <div className="bg-white/20 backdrop-blur rounded-xl p-8 mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  PERFEITO PARA SUA OPERAÇÃO.
                </h2>
                <p className="text-xl text-white/90">
                  O sistema completo para gerenciar seu restaurante com eficiência total.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp CTA Section */}
        <WhatsAppCTA />

        {/* Features Section - Updated with explicit styling */}
        <section className="py-20" style={{ backgroundColor: '#4B5563' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-8" style={{ color: 'white' }}>
                TUDO O QUE VOCÊ PRECISA EM UM <span style={{ color: '#FF521D' }}>KOOMBO</span> SÓ.
              </h1>
              
              <h2 className="text-2xl font-light mb-16" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Tenha sua gestão de pedidos tudo sob controle.
              </h2>

              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="bg-koombo-laranja text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white mb-3">Gestão de Pedidos</h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Controle total sobre todos os pedidos, desde o recebimento até a entrega.
                      Acompanhe o status em tempo real e mantenha seus clientes sempre informados.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="bg-koombo-laranja text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Utensils className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white mb-3">Cozinha Integrada</h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Sistema integrado para a cozinha acompanhar e gerenciar os pedidos em tempo real.
                      Otimize o fluxo de trabalho e reduza o tempo de preparo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="bg-koombo-laranja text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white mb-3">Relatórios Completos</h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Acompanhe vendas, clientes e performance com relatórios detalhados.
                      Tome decisões baseadas em dados e faça seu negócio crescer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  console.log('Rendering restaurant-specific page');
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

      <section className="bg-koombo-cream py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-koombo-grafite mb-4">
            Bem-vindo ao {pageTitle}!
          </h2>
          <p className="text-lg text-koombo-grafite/80">
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
                cartQuantity={getCartQuantity(item.id)}
                onUpdateQuantity={updateQuantity}
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
