
import { ShoppingCart, User, LogOut, Utensils, Settings } from 'lucide-react';
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
    <header className="bg-koombo-grafite shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="/lovable-uploads/4dbc6f49-08b6-40fc-b91a-70f6ee6f7ee6.png" 
            alt="Koombo Logo" 
            className="h-10 w-auto"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {!isAdmin && !isKitchen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="text-koombo-branco hover:bg-white/20 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-koombo-cream text-koombo-grafite">
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
                  className="text-koombo-branco hover:bg-white/20"
                >
                  <Utensils className="h-5 w-5 mr-2" />
                  <span className="hidden sm:block">Cozinha</span>
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-koombo-branco text-sm hidden sm:block">
                  Olá, {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignOut}
                  className="text-koombo-branco hover:bg-white/20"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
          
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdminClick}
              className="text-koombo-branco hover:bg-white/20"
            >
              <Settings className="h-5 w-5" />
              Admin
            </Button>
          )}
          
          {!user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdminClick}
              className="text-koombo-branco hover:bg-white/20"
            >
              <User className="h-5 w-5" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
