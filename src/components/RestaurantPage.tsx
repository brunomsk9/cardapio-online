
import { useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import Header from '@/components/Header';
import RestaurantHero from '@/components/restaurant/RestaurantHero';
import MenuSection from '@/components/restaurant/MenuSection';
import RestaurantModals from '@/components/restaurant/RestaurantModals';
import { CartItem, MenuItem } from '@/types';
import { useRestaurantTheme, getRestaurantTheme } from '@/hooks/useRestaurantTheme';

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

  // Apply restaurant theme
  useRestaurantTheme(restaurant);
  const theme = getRestaurantTheme(restaurant);

  const handleAdminClick = () => {
    setShowAuthModal(true);
    onAdminClick();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onAuthSuccess();
  };

  // Título e descrição baseados no contexto
  const pageTitle = restaurant ? restaurant.name : 'Koombo';
  const pageDescription = restaurant 
    ? (restaurant.description || `Descubra os deliciosos pratos do ${restaurant.name}`)
    : 'Pedidos & Gestão - Descubra os melhores sabores da nossa cozinha.';

  console.log('Rendering restaurant-specific page');
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.secondaryColor }}>
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
        onAdminClick={handleAdminClick}
        user={user}
        onSignOut={onSignOut}
        isAdmin={isAdmin}
        isKitchen={isKitchen}
        customColors={{ primary: theme.primaryColor, secondary: theme.secondaryColor }}
      />

      <RestaurantHero
        restaurant={restaurant}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />

      <MenuSection
        restaurant={restaurant}
        menuItems={menuItems}
        cart={cart}
        onAddToCart={onAddToCart}
        onUpdateQuantity={onUpdateQuantity}
      />

      <RestaurantModals
        showCart={showCart}
        setShowCart={setShowCart}
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        totalPrice={getTotalPrice()}
        user={user}
        onClearCart={onClearCart}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default RestaurantPage;
