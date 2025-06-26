
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
        onAdminClick={handleAdminClick}
        user={user}
        onSignOut={onSignOut}
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
                onAddToCart={() => onAddToCart(item)}
                cartQuantity={getCartQuantity(item.id)}
                onUpdateQuantity={onUpdateQuantity}
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
