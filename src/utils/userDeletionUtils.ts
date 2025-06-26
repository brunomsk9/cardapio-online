
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const deleteUser = async (userId: string, userName: string) => {
  console.log('Iniciando exclusão do usuário:', userId, userName);
  
  try {
    // 1. Remover associações usuário-restaurante
    const { error: userRestaurantsError } = await supabase
      .from('user_restaurants')
      .delete()
      .eq('user_id', userId);

    if (userRestaurantsError) {
      console.error('Erro ao remover associações usuário-restaurante:', userRestaurantsError);
      throw new Error('Não foi possível remover as associações do usuário com restaurantes.');
    }

    console.log('Associações usuário-restaurante removidas com sucesso');

    // 2. Remover papéis do usuário
    const { error: userRolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (userRolesError) {
      console.error('Erro ao remover papéis do usuário:', userRolesError);
      throw new Error('Não foi possível remover os papéis do usuário.');
    }

    console.log('Papéis do usuário removidos com sucesso');

    // 3. Remover notificações do usuário
    const { error: notificationsError } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    if (notificationsError) {
      console.error('Erro ao remover notificações do usuário:', notificationsError);
      // Não interrompe o processo se não conseguir remover notificações
    } else {
      console.log('Notificações do usuário removidas com sucesso');
    }

    // 4. Remover pedidos do usuário (opcional - pode querer manter histórico)
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .eq('user_id', userId);

    if (ordersError) {
      console.error('Erro ao remover pedidos do usuário:', ordersError);
      // Não interrompe o processo se não conseguir remover pedidos
    } else {
      console.log('Pedidos do usuário removidos com sucesso');
    }

    // 5. Remover endereços do usuário
    const { error: addressesError } = await supabase
      .from('addresses')
      .delete()
      .eq('user_id', userId);

    if (addressesError) {
      console.error('Erro ao remover endereços do usuário:', addressesError);
      // Não interrompe o processo se não conseguir remover endereços
    } else {
      console.log('Endereços do usuário removidos com sucesso');
    }

    // 6. Remover perfil do usuário
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Erro ao remover perfil do usuário:', profileError);
      throw new Error('Não foi possível remover o perfil do usuário.');
    }

    console.log('Perfil do usuário removido com sucesso');

    // 7. Tentar remover usuário da autenticação (via admin API)
    // Nota: Isso requer permissões de admin e pode falhar em alguns casos
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Erro ao remover usuário da autenticação:', authError);
        // Não interrompe o processo - o usuário foi removido dos dados públicos
        toast({
          title: "Usuário excluído parcialmente",
          description: `${userName} foi removido do sistema, mas a conta de autenticação pode ainda existir. Entre em contato com o suporte se necessário.`,
          variant: "default",
        });
      } else {
        console.log('Usuário removido da autenticação com sucesso');
        toast({
          title: "Usuário excluído com sucesso!",
          description: `${userName} foi completamente removido do sistema.`,
        });
      }
    } catch (authError) {
      console.error('Erro ao acessar API de admin:', authError);
      toast({
        title: "Usuário excluído parcialmente",
        description: `${userName} foi removido do sistema, mas a conta de autenticação pode ainda existir.`,
        variant: "default",
      });
    }

  } catch (error: any) {
    console.error('Erro na exclusão do usuário:', error);
    
    let errorMessage = error.message || 'Ocorreu um erro inesperado ao excluir o usuário.';
    
    if (error.message?.includes('foreign key constraint')) {
      errorMessage = 'Não é possível excluir este usuário pois ele possui dados associados no sistema.';
    }
    
    toast({
      title: "Erro ao excluir usuário",
      description: errorMessage,
      variant: "destructive",
    });
    
    throw error;
  }
};
