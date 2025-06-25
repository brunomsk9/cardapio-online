
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface UserRoleSelectProps {
  userId: string;
  currentRole: 'user' | 'admin' | 'kitchen' | 'super_admin';
  onRoleUpdate: () => void;
}

const UserRoleSelect = ({ userId, currentRole, onRoleUpdate }: UserRoleSelectProps) => {
  const { isSuperAdmin } = useUserRole();

  const updateUserRole = async (newRole: 'user' | 'admin' | 'kitchen' | 'super_admin') => {
    try {
      console.log('Updating user role:', userId, 'to', newRole);
      
      if (!isSuperAdmin && newRole === 'super_admin') {
        toast({
          title: "Acesso negado",
          description: "Apenas super administradores podem atribuir o papel de super admin.",
          variant: "destructive",
        });
        return;
      }

      if (newRole === 'kitchen') {
        const { data: userRestaurants, error: restaurantError } = await supabase
          .from('user_restaurants')
          .select('restaurant_id')
          .eq('user_id', userId);

        if (restaurantError) throw restaurantError;

        if (userRestaurants && userRestaurants.length > 1) {
          toast({
            title: "Erro ao atribuir papel Kitchen",
            description: "Não é possível atribuir papel Kitchen a usuário associado a múltiplos restaurantes. Mantenha apenas uma associação.",
            variant: "destructive",
          });
          return;
        }
      }

      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) {
        if (error.message.includes('múltiplos restaurantes')) {
          toast({
            title: "Erro ao atribuir papel Kitchen",
            description: "Não é possível atribuir papel Kitchen a usuário associado a múltiplos restaurantes. Mantenha apenas uma associação.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      onRoleUpdate();

      toast({
        title: "Papel atualizado!",
        description: "O papel do usuário foi atualizado com sucesso.",
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erro ao atualizar papel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Select
      value={currentRole}
      onValueChange={updateUserRole}
    >  
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">Usuário</SelectItem>
        <SelectItem value="kitchen">Cozinha</SelectItem>
        <SelectItem value="admin">Administrador</SelectItem>
        {isSuperAdmin && (
          <SelectItem value="super_admin">Super Admin</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default UserRoleSelect;
