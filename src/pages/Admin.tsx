
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RestaurantsManagement from '@/components/admin/RestaurantsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import UserProfile from '@/components/UserProfile';
import MenuManagement from '@/components/admin/MenuManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import OrdersTracking from '@/components/admin/OrdersTracking';
import SettingsManagement from '@/components/admin/SettingsManagement';
import RestaurantUsersManagement from '@/components/admin/RestaurantUsersManagement';
import RestaurantSettings from '@/components/admin/RestaurantSettings';
import CustomersManagement from '@/components/admin/CustomersManagement';
import { useUserRole } from '@/hooks/useUserRole';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const { isSuperAdmin } = useUserRole();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'tracking':
        return <OrdersTracking />;
      case 'restaurants':
        return <RestaurantsManagement />;
      case 'users':
        // Super admins veem todos os usuários, admins veem usuários do restaurante
        return isSuperAdmin ? <UsersManagement /> : <RestaurantUsersManagement />;
      case 'customers':
        return <CustomersManagement />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        // Super admins veem configurações gerais, admins veem configurações do restaurante
        return isSuperAdmin ? <SettingsManagement /> : <RestaurantSettings />;
      default:
        return <MenuManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isSuperAdmin ? 'Super Admin' : 'Administração'}
          </h1>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
