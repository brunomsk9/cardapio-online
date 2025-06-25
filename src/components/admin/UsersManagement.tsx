import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Phone, Calendar, Shield, Building2, Link } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useUserRole } from '@/hooks/useUserRole';
import UserRestaurantAssignment from './UserRestaurantAssignment';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
};

const UsersManagement = () => {
  const { isSuperAdmin } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const { data: userRestaurants, error: userRestaurantsError } = await supabase
        .from('user_restaurants')
        .select(`
          user_id,
          restaurant:restaurants(name)
        `);

      if (userRestaurantsError) throw userRestaurantsError;

      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id).map(role => ({ role: role.role })) || [],
        user_restaurants: userRestaurants?.filter(ur => ur.user_id === profile.id) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'kitchen' | 'super_admin') => {
    try {
      if (!isSuperAdmin && newRole === 'super_admin') {
        toast({
          title: "Acesso negado",
          description: "Apenas super administradores podem atribuir o papel de super admin.",
          variant: "destructive",
        });
        return;
      }

      // Verificar se é mudança para kitchen e usuário tem múltiplos restaurantes
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

      fetchUsers();

      toast({
        title: "Papel atualizado!",
        description: "O papel do usuário foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar papel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (roles: { role: string }[] | undefined) => {
    if (!roles || roles.length === 0) {
      return <Badge variant="outline">Usuário</Badge>;
    }

    const role = roles[0].role;
    const roleConfig = {
      super_admin: { label: 'Super Admin', variant: 'default' as const },
      admin: { label: 'Administrador', variant: 'destructive' as const },
      kitchen: { label: 'Cozinha', variant: 'secondary' as const },
      user: { label: 'Usuário', variant: 'outline' as const },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    
    return (
      <Badge variant={config.variant}>
        <Shield className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getCurrentRole = (roles: { role: string }[] | undefined): 'user' | 'admin' | 'kitchen' | 'super_admin' => {
    if (!roles || roles.length === 0) return 'user';
    return roles[0].role as 'user' | 'admin' | 'kitchen' | 'super_admin';
  };

  const handleAssignRestaurants = (user: UserProfile) => {
    setSelectedUser(user);
    setShowAssignmentDialog(true);
  };

  const handleCloseAssignment = () => {
    setShowAssignmentDialog(false);
    setSelectedUser(null);
    fetchUsers(); // Refresh data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Usuários</h3>
        <div className="text-sm text-gray-600">
          Total: {users.length} usuários
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.full_name || 'Nome não informado'}</h4>
                      <p className="text-sm text-gray-600">ID: {user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {user.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {user.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {user.user_restaurants && user.user_restaurants.length > 0 && (
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {user.user_restaurants.length} restaurante(s): {' '}
                        {user.user_restaurants.map((ur, index) => (
                          <span key={index}>
                            {ur.restaurant?.name}
                            {index < user.user_restaurants!.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex flex-col items-end">
                  {getRoleBadge(user.user_roles)}
                  <div className="flex gap-2">
                    <Select
                      value={getCurrentRole(user.user_roles)}
                      onValueChange={(value: 'user' | 'admin' | 'kitchen' | 'super_admin') => updateUserRole(user.id, value)}
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
                    
                    {(getCurrentRole(user.user_roles) === 'admin' || getCurrentRole(user.user_roles) === 'kitchen') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignRestaurants(user)}
                      >
                        <Link className="h-4 w-4 mr-1" />
                        Restaurantes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum usuário encontrado.
          </p>
        </div>
      )}

      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Associar Restaurantes</DialogTitle>
            <DialogDescription>
              Selecione os restaurantes que este usuário pode gerenciar.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserRestaurantAssignment
              userId={selectedUser.id}
              userName={selectedUser.full_name || 'Usuário'}
              userRole={getCurrentRole(selectedUser.user_roles)}
              onClose={handleCloseAssignment}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
