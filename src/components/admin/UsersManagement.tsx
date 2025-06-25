import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Users, Phone, Calendar, Shield, Building2, Link, Plus, RefreshCw } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useUserRole } from '@/hooks/useUserRole';
import UserRestaurantAssignment from './UserRestaurantAssignment';
import UserCreationForm from './UserCreationForm';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
  email?: string;
};

const UsersManagement = () => {
  const { isSuperAdmin } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showCreationForm, setShowCreationForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const syncUsersWithAuth = async () => {
    try {
      setSyncing(true);
      console.log('Iniciando sincronização de usuários...');
      
      // Buscar todos os usuários da tabela auth (via RPC função)
      const { data: authUsers, error: authError } = await supabase
        .rpc('get_all_users_profiles');

      if (authError) {
        console.error('Erro ao buscar usuários auth:', authError);
        toast({
          title: "Erro na sincronização",
          description: "Não foi possível acessar os usuários da tabela de autenticação.",
          variant: "destructive",
        });
        return;
      }

      console.log('Usuários auth encontrados:', authUsers?.length || 0);

      // Buscar perfis existentes
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id');

      const existingIds = existingProfiles?.map(p => p.id) || [];
      
      // Identificar usuários sem perfil
      const usersWithoutProfile = authUsers?.filter(user => 
        !existingIds.includes(user.id)
      ) || [];

      console.log('Usuários sem perfil:', usersWithoutProfile.length);

      // Criar perfis para usuários sem perfil
      if (usersWithoutProfile.length > 0) {
        const profilesToCreate = usersWithoutProfile.map(user => ({
          id: user.id,
          full_name: user.email?.split('@')[0] || 'Usuário',
          phone: null
        }));

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profilesToCreate);

        if (insertError) {
          console.error('Erro ao criar perfis:', insertError);
          toast({
            title: "Erro na sincronização",  
            description: "Alguns perfis não puderam ser criados.",
            variant: "destructive",
          });
        } else {
          console.log('Perfis criados com sucesso:', profilesToCreate.length);
        }
      }

      // Buscar usuários atualizados
      await fetchUsers();
      
      toast({
        title: "Sincronização concluída!",
        description: `${usersWithoutProfile.length} perfis foram sincronizados.`,
      });

    } catch (error: any) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar todos os usuários.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Iniciando busca de usuários...');
      setLoading(true);
      
      // Buscar todos os perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
        toast({
          title: "Erro ao carregar perfis",
          description: profilesError.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Perfis encontrados:', profiles?.length || 0);

      // Buscar papéis dos usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Erro ao buscar papéis:', rolesError);
        toast({
          title: "Erro ao carregar papéis",
          description: rolesError.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Papéis encontrados:', userRoles?.length || 0);

      // Buscar associações usuário-restaurante
      const { data: userRestaurants, error: userRestaurantsError } = await supabase
        .from('user_restaurants')
        .select(`
          user_id,
          restaurant:restaurants(name)
        `);

      if (userRestaurantsError) {
        console.error('Erro ao buscar associações usuário-restaurante:', userRestaurantsError);
        console.log('Continuando sem as associações de restaurantes...');
      }

      console.log('Associações usuário-restaurante encontradas:', userRestaurants?.length || 0);

      // Buscar emails dos usuários via RPC
      const { data: userEmails, error: emailsError } = await supabase
        .rpc('get_users_emails', { user_ids: profiles?.map(p => p.id) || [] });

      if (emailsError) {
        console.error('Erro ao buscar emails:', emailsError);
      }

      console.log('Emails encontrados:', userEmails?.length || 0);

      // Combinar dados
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id).map(role => ({ role: role.role })) || [],
        user_restaurants: userRestaurants?.filter(ur => ur.user_id === profile.id) || [],
        email: userEmails?.find(email => email.user_id === profile.id)?.email || null
      })) || [];

      console.log('Usuários processados:', usersWithRoles.length);
      setUsers(usersWithRoles);

    } catch (error: any) {
      console.error('Erro geral na busca de usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Ocorreu um erro inesperado ao carregar os usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'kitchen' | 'super_admin') => {
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

      fetchUsers();

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
    fetchUsers();
  };

  const handleUserCreated = () => {
    fetchUsers();
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
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total: {users.length} usuários
          </div>
          <Button
            onClick={syncUsersWithAuth}
            disabled={syncing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
          <Button
            onClick={() => setShowCreationForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Usuário
          </Button>
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
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.full_name || 'Nome não informado'}</h4>
                      <p className="text-sm text-gray-600">ID: {user.id.slice(0, 8)}...</p>
                      {user.email && (
                        <p className="text-sm text-gray-500">{user.email}</p>
                      )}
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
          <p className="text-sm text-gray-400 mt-2">
            Clique em "Sincronizar" para buscar usuários da tabela de autenticação.
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

      <UserCreationForm 
        isOpen={showCreationForm}
        onClose={() => setShowCreationForm(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default UsersManagement;
