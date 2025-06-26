
import { ShoppingCart, User, ChefHat, LogOut, Utensils, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  user?: SupabaseUser | null;
  onSignOut?: () => void;
  isAdmin?: boolean;
  isKitchen?: boolean;
}

const Header = ({ cartItemsCount, onCartClick, onAdminClick, user, onSignOut, isAdmin = false, isKitchen = false }: HeaderProps) => {
  const navigate = useNavigate();

  const handleKitchenClick = () => {
    if (isAdmin || isKitchen) {
      navigate('/kitchen');
    }
  };

  return (
    <header className="bg-koombo-white border-b border-koombo-graphite shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-koombo-orange p-2 rounded-xl">
            <ChefHat className="h-6 w-6 text-koombo-white" />
          </div>
          <div className="text-koombo-graphite">
            <h1 className="text-2xl font-bold font-venice tracking-tight">KOOMBO</h1>
            <p className="text-xs text-koombo-graphite/70 -mt-1 font-medium">PEDIDOS & GESTÃO</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isAdmin && !isKitchen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="text-koombo-graphite hover:bg-koombo-white/50 relative p-3 rounded-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-koombo-orange text-koombo-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          )}
          
          {user && (
            <>
              {(isAdmin || isKitchen) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleKitchenClick}
                  className="text-koombo-graphite hover:bg-koombo-white/50 px-4 py-2 rounded-xl"
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  <span className="hidden sm:block font-medium">Cozinha</span>
                </Button>
              )}
              
              <div className="flex items-center space-x-3">
                <span className="text-koombo-graphite text-sm font-medium hidden sm:block">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignOut}
                  className="text-koombo-graphite hover:bg-koombo-white/50 p-3 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdminClick}
              className="text-koombo-graphite hover:bg-koombo-white/50 px-4 py-2 rounded-xl"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="font-medium">Admin</span>
            </Button>
          )}
          
          {!user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdminClick}
              className="text-koombo-graphite hover:bg-koombo-white/50 px-4 py-2 rounded-xl"
            >
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
