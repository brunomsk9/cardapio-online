import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RestaurantsManagement from '@/components/admin/RestaurantsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import UserProfile from '@/components/UserProfile';
import MenuManagement from '@/components/admin/MenuManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';
import RestaurantUsersManagement from '@/components/admin/RestaurantUsersManagement';
import RestaurantSettings from '@/components/admin/RestaurantSettings';
import CustomersManagement from '@/components/admin/CustomersManagement';
import { useUserRole } from '@/hooks/useUserRole';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const { isSuperAdmin } = useUserRole();

  const renderContent = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrdersManagement />;
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
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
