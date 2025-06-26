
import { User as SupabaseUser } from '@supabase/supabase-js';
import Cart from '@/components/Cart';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import AuthModal from '@/components/auth/AuthModal';
import { CartItem } from '@/types';

interface RestaurantModalsProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  totalPrice: number;
  user: SupabaseUser | null;
  onClearCart: () => void;
  onAuthSuccess: () => void;
}

const RestaurantModals = ({
  showCart,
  setShowCart,
  showCheckout,
  setShowCheckout,
  showAuthModal,
  setShowAuthModal,
  cart,
  onUpdateQuantity,
  totalPrice,
  user,
  onClearCart,
  onAuthSuccess
}: RestaurantModalsProps) => {
  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <>
      {showCart && (
        <Cart
          cart={cart}
          onUpdateQuantity={onUpdateQuantity}
          onClose={() => setShowCart(false)}
          totalPrice={totalPrice}
          onCheckout={handleCheckout}
        />
      )}

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        totalPrice={totalPrice}
        user={user}
        onClearCart={onClearCart}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onAuthSuccess}
      />
    </>
  );
};

export default RestaurantModals;
