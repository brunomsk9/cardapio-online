
import AdminPanel from '@/components/AdminPanel';
import { mockMenuItems } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  // Toda lógica de proteção é delegada para ProtectedRoute
  // Esta página só renderiza se o usuário for admin

  const handleUpdateMenuItem = (item: any) => {
    console.log('Update menu item:', item);
    toast({
      title: "Item atualizado!",
      description: "O item do cardápio foi atualizado com sucesso.",
    });
  };

  const handleDeleteMenuItem = (itemId: string) => {
    console.log('Delete menu item:', itemId);
    toast({
      title: "Item removido!",
      description: "O item foi removido do cardápio.",
    });
  };

  const handleAddMenuItem = (item: any) => {
    console.log('Add menu item:', item);
    toast({
      title: "Item adicionado!",
      description: "O novo item foi adicionado ao cardápio.",
    });
  };

  return (
    <AdminPanel
      menuItems={mockMenuItems}
      onUpdateMenuItem={handleUpdateMenuItem}
      onDeleteMenuItem={handleDeleteMenuItem}
      onAddMenuItem={handleAddMenuItem}
    />
  );
};

export default Admin;
