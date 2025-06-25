
import { useState } from 'react';
import { ChefHat, Users, ShoppingBag, UtensilsCrossed, Settings, Menu, X, Building2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RestaurantSelector from '@/components/RestaurantSelector';
import { useUserRole } from '@/hooks/useUserRole';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSuperAdmin } = useUserRole();

  const menuItems = [
    { id: 'menu', label: 'Cardápio', icon: UtensilsCrossed },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    ...(isSuperAdmin ? [{ id: 'restaurants', label: 'Restaurantes', icon: Building2 }] : []),
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'profile', label: 'Meu Perfil', icon: UserCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-white shadow-lg border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <ChefHat className="h-6 w-6 text-orange-500" />
              <h2 className="font-bold text-lg">Admin Panel</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        
        {!isCollapsed && (
          <div className="mt-4">
            <RestaurantSelector />
          </div>
        )}
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activeSection === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed ? "px-2" : "px-4",
                  activeSection === item.id && "bg-orange-100 text-orange-700 hover:bg-orange-200"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
