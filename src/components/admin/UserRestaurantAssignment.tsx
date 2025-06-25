
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Building2, Users, Link } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface UserRestaurantAssignmentProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

const UserRestaurantAssignment = ({ userId, userName, onClose }: UserRestaurantAssignmentProps) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [userRestaurants, setUserRestaurants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      // Buscar todos os restaurantes
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (restaurantsError) throw restaurantsError;

      // Buscar restaurantes do usuário
      const { data: userRestaurantsData, error: userRestaurantsError } = await supabase
        .from('user_restaurants')
        .select('restaurant_id')
        .eq('user_id', userId);

      if (userRestaurantsError) throw userRestaurantsError;

      setRestaurants(restaurantsData || []);
      setUserRestaurants(userRestaurantsData?.map(ur => ur.restaurant_id) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantToggle = (restaurantId: string, checked: boolean) => {
    if (checked) {
      setUserRestaurants([...userRestaurants, restaurantId]);
    } else {
      setUserRestaurants(userRestaurants.filter(id => id !== restaurantId));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Remover todas as associações existentes
      await supabase
        .from('user_restaurants')
        .delete()
        .eq('user_id', userId);

      // Adicionar novas associações
      if (userRestaurants.length > 0) {
        const { error: insertError } = await supabase
          .from('user_restaurants')
          .insert(
            userRestaurants.map(restaurantId => ({
              user_id: userId,
              restaurant_id: restaurantId
            }))
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Associações atualizadas!",
        description: "Os restaurantes foram associados ao usuário com sucesso.",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar associações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Link className="h-5 w-5" />
        <h3 className="text-lg font-medium">
          Associar Restaurantes para {userName}
        </h3>
      </div>

      <div className="space-y-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  <div>
                    <h4 className="font-medium">{restaurant.name}</h4>
                    {restaurant.description && (
                      <p className="text-sm text-gray-600">{restaurant.description}</p>
                    )}
                  </div>
                </div>
                <Checkbox
                  checked={userRestaurants.includes(restaurant.id)}
                  onCheckedChange={(checked) => 
                    handleRestaurantToggle(restaurant.id, checked as boolean)
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Nenhum restaurante ativo encontrado.
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Associações'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default UserRestaurantAssignment;
