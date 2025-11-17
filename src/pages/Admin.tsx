
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, ChefHat } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RestaurantsManagement from '@/components/admin/RestaurantsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import UserProfile from '@/components/UserProfile';
import MenuManagement from '@/components/admin/MenuManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import OrdersTracking from '@/components/admin/OrdersTracking';
import SettingsManagement from '@/components/admin/SettingsManagement';
import RestaurantUsersManagement from '@/components/admin/RestaurantUsersManagement';
import RestaurantSettings from '@/components/admin/RestaurantSettings';
import CustomersManagement from '@/components/admin/CustomersManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import { useUserRole } from '@/hooks/useUserRole';
import { useOrderNotificationSound } from '@/hooks/useOrderNotificationSound';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const { isSuperAdmin } = useUserRole();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // Enable order notification sound
  useOrderNotificationSound(true);

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

  const handleKitchenAccess = () => {
    navigate('/kitchen');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuManagement />;
      case 'categories':
        return <CategoriesManagement />;
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
      case 'reports':
        return <ReportsManagement />;
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

      {/* FAB - Floating Action Button para Cozinha */}
      <Button
        onClick={handleKitchenAccess}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 z-50 group"
        title="Ir para Cozinha"
      >
        <ChefHat className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </Button>
    </div>
  );
};

export default Admin;
