import { useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import Cart from '@/components/Cart';
import CategoryFilter from '@/components/CategoryFilter';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import AuthModal from '@/components/auth/AuthModal';
import { CartItem, MenuItem } from '@/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantPageProps {
  restaurant: Restaurant | null;
  menuItems: MenuItem[];
  user: SupabaseUser | null;
  isAdmin: boolean;
  isKitchen: boolean;
  cart: CartItem[];
  onAdminClick: () => void;
  onSignOut: () => void;
  onAuthSuccess: () => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  onClearCart: () => void;
}

const RestaurantPage = ({
  restaurant,
  menuItems,
  user,
  isAdmin,
  isKitchen,
  cart,
  onAdminClick,
  onSignOut,
  onAuthSuccess,
  onAddToCart,
  onUpdateQuantity,
  getTotalPrice,
  getTotalItems,
  onClearCart
}: RestaurantPageProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleAdminClick = () => {
    setShowAuthModal(true);
    onAdminClick();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onAuthSuccess();
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
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  // Helper function to get cart quantity for an item
  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Título e descrição baseados no contexto
  const pageTitle = restaurant ? restaurant.name : 'Koombo';
  const pageDescription = restaurant 
    ? (restaurant.description || `Descubra os deliciosos pratos do ${restaurant.name}`)
    : 'Pedidos & Gestão - Descubra os melhores sabores da nossa cozinha.';

  console.log('Rendering restaurant-specific page');
  
  return (
    <div className="min-h-screen bg-koombo-grafite">
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
        onAdminClick={handleAdminClick}
        user={user}
        onSignOut={onSignOut}
        isAdmin={isAdmin}
        isKitchen={isKitchen}
      />

      {/* Hero Section do Restaurante */}
      <section className="relative bg-koombo-grafite min-h-[500px] flex items-center overflow-hidden">
        <div className="container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Lado esquerdo - Texto */}
            <div className="text-koombo-branco space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                BEM-VINDO AO <br />
                <span className="text-koombo-laranja">{pageTitle.toUpperCase()}</span>
              </h1>
              
              <p className="text-lg lg:text-xl font-light text-koombo-branco/90 max-w-md">
                {pageDescription}
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={() => document.querySelector('#cardapio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-koombo-laranja hover:bg-koombo-laranja/90 text-koombo-branco font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
                >
                  Ver Cardápio
                </button>
              </div>
            </div>

            {/* Lado direito - Imagem do restaurante ou placeholder */}
            <div className="relative">
              <div 
                className="w-full h-[350px] lg:h-[400px] bg-cover bg-center rounded-2xl shadow-2xl"
                style={{
                  backgroundImage: restaurant?.logo_url 
                    ? `url('${restaurant.logo_url}')`
                    : `url('/lovable-uploads/0c88a4e4-020c-4637-bce1-b2b693821e08.png')`
                }}
              >
                {/* Overlay sutil para melhor contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-koombo-laranja/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-koombo-laranja/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-koombo-laranja/10 rounded-full"></div>
      </section>

      {/* Seção do Cardápio - Fundo laranja */}
      <section id="cardapio" className="bg-koombo-laranja py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-koombo-branco mb-4">
              NOSSO <span className="text-koombo-grafite">CARDÁPIO</span>
            </h2>
            <p className="text-lg text-koombo-branco/90 font-medium">
              Escolha entre nossos deliciosos pratos e sabores únicos
            </p>
          </div>

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={() => onAddToCart(item)}
                  cartQuantity={getCartQuantity(item.id)}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-koombo-branco rounded-xl p-8 shadow-lg max-w-md mx-auto border border-gray-200">
                <p className="text-koombo-grafite text-lg font-semibold mb-2">
                  {restaurant 
                    ? `${restaurant.name} ainda não possui itens no cardápio.`
                    : 'Nenhum item encontrado nesta categoria.'
                  }
                </p>
                <p className="text-koombo-grafite/60">
                  Volte em breve para conferir nossas novidades!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {showCart && (
        <Cart
          cart={cart}
          onUpdateQuantity={onUpdateQuantity}
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
        onClearCart={onClearCart}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default RestaurantPage;
