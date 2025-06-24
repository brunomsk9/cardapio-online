
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
};

const UsersManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id).map(role => ({ role: role.role })) || []
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

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Primeiro, remove o papel atual do usuário
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Depois, adiciona o novo papel
      if (newRole !== 'none') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      // Atualiza a lista local
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
      admin: { label: 'Administrador', color: 'bg-red-100 text-red-800' },
      kitchen: { label: 'Cozinha', color: 'bg-orange-100 text-orange-800' },
      user: { label: 'Usuário', color: 'bg-gray-100 text-gray-800' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    
    return (
      <Badge className={config.color}>
        <Shield className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getCurrentRole = (roles: { role: string }[] | undefined) => {
    if (!roles || roles.length === 0) return 'user';
    return roles[0].role;
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
                <div className="space-y-3">
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
                </div>

                <div className="space-y-3">
                  {getRoleBadge(user.user_roles)}
                  <Select
                    value={getCurrentRole(user.user_roles)}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="kitchen">Cozinha</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
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
    </div>
  );
};

export default UsersManagement;
