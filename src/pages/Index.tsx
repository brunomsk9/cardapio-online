
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
import { mockMenuItems } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { ChefHat, Clock, Star, MapPin } from 'lucide-react';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, isKitchen, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  console.log('🏠 Index page - Current state:', { 
    userEmail: user?.email,
    userId: user?.id, 
    authLoading, 
    roleLoading,
    isAdmin, 
    isKitchen 
  });

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
    console.log('🔑 Admin toggle clicked - Current state:', { 
      hasUser: !!user, 
      userEmail: user?.email,
      isAdmin, 
      authLoading, 
      roleLoading 
    });
    
    // Wait for loading to complete before making decisions
    if (authLoading || roleLoading) {
      console.log('⏳ Still loading, cannot proceed with admin toggle');
      toast({
        title: "Aguarde",
        description: "Carregando informações do usuário...",
      });
      return;
    }
    
    if (user && isAdmin) {
      console.log('✅ User is admin, navigating to admin panel');
      navigate('/admin');
    } else if (user && !isAdmin) {
      console.log('🚫 User is not admin, showing access denied message');
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o painel administrativo.",
        variant: "destructive",
      });
    } else {
      console.log('👤 Not logged in, showing auth modal');
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

  const filteredItems = activeCategory === 'all'
    ? mockMenuItems
    : mockMenuItems.filter(item => item.category === activeCategory);

  // Show loading while checking auth and roles
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
          {user?.email && <p className="text-sm text-gray-500">Usuário: {user.email}</p>}
        </div>
      </div>
    );
  }

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
            Bem-vindo ao Sabor & Arte!
          </h2>
          <p className="text-lg text-gray-700">
            Descubra os melhores sabores da nossa cozinha.
          </p>
        </div>
      </section>

      <section className="container mx-auto mt-8">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={() => addToCart(item)}
            />
          ))}
        </div>
      </section>

      {/* Mostrar carrinho apenas quando showCart for true */}
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
