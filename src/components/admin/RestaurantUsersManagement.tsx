
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Building2 } from 'lucide-react';
import { useUsersData } from '@/hooks/useUsersData';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import { Database } from '@/integrations/supabase/types';
import UserCard from './UserCard';
import RestaurantUserCreation from './RestaurantUserCreation';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
  email?: string;
};

const RestaurantUsersManagement = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const { users, loading, fetchUsers } = useUsersData();
  const [showCreationForm, setShowCreationForm] = useState(false);

  // Filtrar usuários que pertencem ao restaurante selecionado
  const restaurantUsers = users.filter(user => 
    user.user_restaurants?.some(ur => 
      ur.restaurant && selectedRestaurant && 
      ur.restaurant.name === selectedRestaurant.name
    )
  );

  const handleUserCreated = () => {
    fetchUsers();
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  if (!selectedRestaurant) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Selecione um restaurante para gerenciar seus usuários.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários do {selectedRestaurant.name}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {restaurantUsers.length} usuários
              </Badge>
              <Button
                onClick={() => setShowCreationForm(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Usuário
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {restaurantUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onRoleUpdate={fetchUsers}
                onAssignRestaurants={() => {}} // Não permitir reatribuição aqui
                onUserDeleted={handleUserDeleted}
                hideRestaurantAssignment={true}
              />
            ))}
          </div>

          {restaurantUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Nenhum usuário encontrado para este restaurante.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Clique em "Criar Usuário" para adicionar novos membros à sua equipe.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <RestaurantUserCreation 
        isOpen={showCreationForm}
        onClose={() => setShowCreationForm(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default RestaurantUsersManagement;
