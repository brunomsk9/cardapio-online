
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import UserCard from './UserCard';
import UserSyncButton from './UserSyncButton';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
  email?: string;
};

interface UsersListProps {
  users: UserProfile[];
  loading: boolean;
  syncing: boolean;
  onSync: () => Promise<void>;
  onRoleUpdate: () => void;
  onAssignRestaurants: (user: UserProfile) => void;
  onCreateUser: () => void;
}

const UsersList = ({ 
  users, 
  loading, 
  syncing, 
  onSync, 
  onRoleUpdate, 
  onAssignRestaurants, 
  onCreateUser 
}: UsersListProps) => {
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
          <UserSyncButton onSync={onSync} syncing={syncing} />
          <Button
            onClick={onCreateUser}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Usuário
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onRoleUpdate={onRoleUpdate}
            onAssignRestaurants={onAssignRestaurants}
            onUserDeleted={onRoleUpdate}
          />
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
    </div>
  );
};

export default UsersList;
