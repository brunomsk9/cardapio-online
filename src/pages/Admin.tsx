
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

  console.log('🔐 Admin page - Current state:', { 
    userEmail: user?.email,
    userId: user?.id, 
    authLoading, 
    roleLoading, 
    userRole,
    isAdmin,
    totalLoading: authLoading || roleLoading
  });

  useEffect(() => {
    console.log('🎯 Admin useEffect triggered - checking access...');
    console.log('📊 Current values:', { 
      authLoading, 
      roleLoading, 
      hasUser: !!user, 
      userEmail: user?.email,
      userRole,
      isAdmin 
    });
    
    // Only proceed with checks when both auth and role loading are complete
    if (!authLoading && !roleLoading) {
      console.log('✅ Loading complete, performing access checks...');
      
      // If no user, redirect immediately
      if (!user) {
        console.log('❌ No user authenticated, redirecting to home');
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // If user exists but role is not admin, redirect
      if (user && !isAdmin) {
        console.log('🚫 User is not admin, redirecting to home. Current role:', userRole);
        toast({
          title: "Acesso negado",  
          description: `Você não tem permissão para acessar o painel administrativo. Papel atual: ${userRole || 'indefinido'}`,
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      console.log('🎉 User has admin access, showing admin panel');
    } else {
      console.log('⏳ Still loading... Auth:', authLoading, 'Role:', roleLoading);
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate, userRole]);

  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    console.log('🔄 Showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Verificando permissões...
          </p>
          <p className="text-sm text-gray-500">
            {user?.email && `Usuário: ${user.email}`}
          </p>
        </div>
      </div>
    );
  }

  // Don't render admin panel if user is not admin
  if (!user || !isAdmin) {
    console.log('🚫 Not rendering admin panel - access denied');
    return null; // Return null instead of showing verification message
  }

  console.log('🎯 Rendering admin panel for user:', user.email);

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
