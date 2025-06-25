
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import RestaurantForm from './restaurants/RestaurantForm';
import RestaurantCard from './restaurants/RestaurantCard';
import RestaurantsEmptyState from './restaurants/RestaurantsEmptyState';
import { 
  fetchRestaurants, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant, 
  toggleRestaurantStatus,
  RestaurantFormData 
} from './restaurants/restaurantService';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

const RestaurantsManagement = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await fetchRestaurants();
      setRestaurants(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar restaurantes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: RestaurantFormData) => {
    try {
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, data);
        toast({
          title: "Restaurante atualizado!",
          description: "As informações foram atualizadas com sucesso.",
        });
      } else {
        await createRestaurant(data);
        toast({
          title: "Restaurante criado!",
          description: "O restaurante foi adicionado com sucesso.",
        });
      }

      loadRestaurants();
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar restaurante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (restaurant: Restaurant) => {
    if (!confirm(`Tem certeza que deseja excluir o restaurante "${restaurant.name}"?`)) {
      return;
    }

    try {
      await deleteRestaurant(restaurant.id);
      toast({
        title: "Restaurante excluído!",
        description: "O restaurante foi removido com sucesso.",
      });
      loadRestaurants();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir restaurante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (restaurant: Restaurant) => {
    try {
      await toggleRestaurantStatus(restaurant.id, restaurant.is_active);
      toast({
        title: "Status atualizado!",
        description: `Restaurante ${restaurant.is_active ? 'desativado' : 'ativado'} com sucesso.`,
      });
      loadRestaurants();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRestaurant(null);
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
        <h3 className="text-2xl font-bold">Gerenciar Restaurantes</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Restaurante
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <RestaurantForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingRestaurant={editingRestaurant}
      />

      <div className="grid gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      {restaurants.length === 0 && (
        <RestaurantsEmptyState onCreateFirst={() => setIsDialogOpen(true)} />
      )}
    </div>
  );
};

export default RestaurantsManagement;
