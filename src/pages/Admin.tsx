
import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RestaurantsManagement from '@/components/admin/RestaurantsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import UserProfile from '@/components/UserProfile';
import MenuManagement from '@/components/admin/MenuManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('menu');

  const renderContent = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'restaurants':
        return <RestaurantsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <SettingsManagement />;
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
