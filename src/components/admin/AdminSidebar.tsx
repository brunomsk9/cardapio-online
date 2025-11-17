
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
    { id: 'categories', label: 'Categorias', icon: ClipboardList },
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
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">
          {isSuperAdmin ? 'Super Admin' : 'Administração'}
        </h1>
      </div>

      {/* Botão de acesso à cozinha - Destacado no topo */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <Button
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          onClick={handleKitchenAccess}
        >
          <ChefHat className="h-5 w-5 mr-2" />
          Acessar Cozinha
        </Button>
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto">
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
      </nav>
    </div>
  );
};

export default AdminSidebar;
