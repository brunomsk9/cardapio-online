
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import AdminPanel from '@/components/AdminPanel';
import { mockMenuItems } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Don't render admin panel if user is not admin
  if (!user || !isAdmin) {
    return null;
  }

  // Mock functions for menu management (these would connect to your actual backend)
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
