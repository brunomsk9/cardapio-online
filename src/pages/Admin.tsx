
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
  const { isAdmin, loading: roleLoading, userRole } = useUserRole();

  console.log('Admin page - Auth state:', { user: user?.id, authLoading, isAdmin, roleLoading, userRole });

  useEffect(() => {
    console.log('Admin useEffect triggered:', { authLoading, roleLoading, user: !!user, isAdmin });
    
    if (!authLoading && !roleLoading) {
      if (!user) {
        console.log('No user, redirecting to home');
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!isAdmin) {
        console.log('User is not admin, redirecting to home. Current role:', userRole);
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      console.log('User has admin access, showing admin panel');
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate, userRole]);

  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    console.log('Showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Don't render admin panel if user is not admin
  if (!user || !isAdmin) {
    console.log('Not rendering admin panel - user or admin check failed');
    return null;
  }

  console.log('Rendering admin panel');

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
