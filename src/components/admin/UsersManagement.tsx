
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Database } from '@/integrations/supabase/types';
import { useUsersData } from '@/hooks/useUsersData';
import UserRestaurantAssignment from './UserRestaurantAssignment';
import UserCreationForm from './UserCreationForm';
import UsersList from './UsersList';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
  email?: string;
};

const UsersManagement = () => {
  const { users, loading, syncing, fetchUsers, syncUsersWithAuth } = useUsersData();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showCreationForm, setShowCreationForm] = useState(false);

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

  return (
    <div className="space-y-6">
      <UsersList
        users={users}
        loading={loading}
        syncing={syncing}
        onSync={syncUsersWithAuth}
        onRoleUpdate={fetchUsers}
        onAssignRestaurants={handleAssignRestaurants}
        onCreateUser={() => setShowCreationForm(true)}
      />

      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent className="max-w-2xl bg-koombo-white border-koombo-graphite">
          <DialogHeader>
            <DialogTitle className="text-koombo-graphite">Associar Restaurantes</DialogTitle>
            <DialogDescription className="text-koombo-graphite/70">
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
