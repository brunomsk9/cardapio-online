
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings, 
  Building2, 
  Menu, 
  UserCheck,
  ClipboardList,
  Eye,
  ChefHat,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const { isSuperAdmin } = useUserRole();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'menu', label: 'Cardápio', icon: Menu },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'tracking', label: 'Acompanhar', icon: Eye },
    { id: 'customers', label: 'Clientes', icon: UserCheck },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    ...(isSuperAdmin ? [
      { id: 'restaurants', label: 'Restaurantes', icon: Building2 },
      { id: 'users', label: 'Usuários', icon: Users }
    ] : [
      { id: 'users', label: 'Equipe', icon: Users }
    ]),
    { id: 'profile', label: 'Perfil', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleKitchenAccess = () => {
    navigate('/kitchen');
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">
          {isSuperAdmin ? 'Super Admin' : 'Administração'}
        </h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start px-6 py-3 text-left mb-1"
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
        
        <div className="border-t mt-4 pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start px-6 py-3 text-left mb-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            onClick={handleKitchenAccess}
          >
            <ChefHat className="h-5 w-5 mr-3" />
            Ir para Cozinha
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
