
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Phone, Calendar, Shield, Building2, Link } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import UserRoleSelect from './UserRoleSelect';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
  email?: string;
};

interface UserCardProps {
  user: UserProfile;
  onRoleUpdate: () => void;
  onAssignRestaurants: (user: UserProfile) => void;
}

const UserCard = ({ user, onRoleUpdate, onAssignRestaurants }: UserCardProps) => {
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

  const currentRole = getCurrentRole(user.user_roles);

  return (
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
              <UserRoleSelect
                userId={user.id}
                currentRole={currentRole}
                onRoleUpdate={onRoleUpdate}
              />
              
              {(currentRole === 'admin' || currentRole === 'kitchen') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAssignRestaurants(user)}
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
  );
};

export default UserCard;
