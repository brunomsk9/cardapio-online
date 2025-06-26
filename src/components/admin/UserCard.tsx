
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Building2, Settings, Trash2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import UserRoleSelect from './UserRoleSelect';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
  email?: string;
};

interface UserCardProps {
  user: UserProfile;
  onRoleUpdate: () => void;
  onAssignRestaurants: (user: UserProfile) => void;
  onUserDeleted?: () => void;
  hideRestaurantAssignment?: boolean;
}

const UserCard = ({ user, onRoleUpdate, onAssignRestaurants, onUserDeleted, hideRestaurantAssignment = false }: UserCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getCurrentRole = (roles: { role: string }[] | undefined): 'user' | 'admin' | 'kitchen' | 'super_admin' => {
    if (!roles || roles.length === 0) return 'user';
    return roles[0].role as 'user' | 'admin' | 'kitchen' | 'super_admin';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'kitchen':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrador';
      case 'kitchen':
        return 'Cozinha';
      default:
        return 'Usuário';
    }
  };

  const handleDeleteUser = async () => {
    if (!onUserDeleted) return;
    
    setIsDeleting(true);
    try {
      const { deleteUser } = await import('@/utils/userDeletionUtils');
      await deleteUser(user.id, user.full_name || 'Usuário');
      onUserDeleted();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentRole = getCurrentRole(user.user_roles);
  const userRestaurants = user.user_restaurants || [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-lg">{user.full_name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {user.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getRoleBadgeColor(currentRole)}>
                  {getRoleLabel(currentRole)}
                </Badge>
                
                {userRestaurants.length > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Building2 className="h-3 w-3" />
                    <span>
                      {userRestaurants.length === 1 
                        ? userRestaurants[0].restaurant?.name
                        : `${userRestaurants.length} restaurantes`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <UserRoleSelect
              userId={user.id}
              currentRole={currentRole}
              onRoleUpdate={onRoleUpdate}
            />
            
            {!hideRestaurantAssignment && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAssignRestaurants(user)}
                className="flex items-center space-x-1"
              >
                <Settings className="h-3 w-3" />
                <span>Restaurantes</span>
              </Button>
            )}

            {onUserDeleted && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o usuário <strong>{user.full_name}</strong>?
                      <br />
                      <br />
                      Esta ação é irreversível e removerá:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>O perfil do usuário</li>
                        <li>Suas permissões e papéis</li>
                        <li>Suas associações com restaurantes</li>
                        <li>Sua conta de autenticação</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteUser}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? 'Excluindo...' : 'Excluir Usuário'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
