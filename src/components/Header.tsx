
import { ShoppingCart, User, ChefHat, LogOut, Utensils } from 'lucide-react';
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
}

const Header = ({ cartItemsCount, onCartClick, onAdminClick, user, onSignOut, isAdmin = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <ChefHat className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Sabor & Arte</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="text-white hover:bg-white/20 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-black">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          )}
          
          {user && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/kitchen')}
                className="text-white hover:bg-white/20"
              >
                <Utensils className="h-5 w-5 mr-2" />
                <span className="hidden sm:block">Cozinha</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm hidden sm:block">
                  Olá, {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignOut}
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdminClick}
            className="text-white hover:bg-white/20"
          >
            <User className="h-5 w-5" />
            {isAdmin ? 'Cliente' : 'Admin'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
