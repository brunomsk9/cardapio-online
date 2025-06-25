
import { useState } from 'react';
import AdminSidebar from './admin/AdminSidebar';
import OrdersManagement from './admin/OrdersManagement';
import UsersManagement from './admin/UsersManagement';
import RestaurantsManagement from './admin/RestaurantsManagement';
import SettingsManagement from './admin/SettingsManagement';
import MenuPanel from './admin/panels/MenuPanel';
import { MenuItem } from '@/types';

interface AdminPanelProps {
  menuItems: MenuItem[];
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>) => void;
}

const AdminPanel = ({ menuItems, onUpdateMenuItem, onDeleteMenuItem, onAddMenuItem }: AdminPanelProps) => {
  const [activeSection, setActiveSection] = useState('menu');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'menu':
        return (
          <MenuPanel
            menuItems={menuItems}
            onUpdateMenuItem={onUpdateMenuItem}
            onDeleteMenuItem={onDeleteMenuItem}
            onAddMenuItem={onAddMenuItem}
          />
        );
      case 'orders':
        return <OrdersManagement />;
      case 'restaurants':
        return <RestaurantsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
