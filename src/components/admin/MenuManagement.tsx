
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import MenuItemForm from './MenuItemForm';
import MenuItemCard from './MenuItemCard';
import MenuEmptyState from './MenuEmptyState';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  available: boolean;
  image_url?: string | null;
}

type MenuItemFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
};

const MenuManagement = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const { 
    menuItems, 
    loading, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleAvailability 
  } = useMenuItems();
  
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (data: MenuItemFormData) => {
    try {
      if (editingItem) {
        // Atualizar item existente
        await updateMenuItem(editingItem.id, {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image_url: data.image_url || null
        });
        
        toast({
          title: "Item atualizado!",
          description: "O item do cardápio foi atualizado com sucesso.",
        });
      } else {
        // Criar novo item
        await createMenuItem({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image_url: data.image_url || null,
          available: true
        });
        
        toast({
          title: "Item criado!",
          description: "O novo item foi adicionado ao cardápio.",
        });
      }

      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Erro ao salvar item",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      return;
    }
    
    try {
      await deleteMenuItem(item.id);
      toast({
        title: "Item removido!",
        description: "O item foi removido do cardápio.",
      });
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Erro ao remover item",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await toggleAvailability(item.id);
      toast({
        title: "Disponibilidade atualizada!",
        description: `Item ${item.available ? 'desabilitado' : 'habilitado'}.`,
      });
    } catch (error: any) {
      console.error('Error toggling availability:', error);
      toast({
        title: "Erro ao atualizar disponibilidade",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleOpenNewItemDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  if (!selectedRestaurant) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Gerenciar Cardápio</h3>
          <p className="text-gray-600">
            Selecione um restaurante para gerenciar o cardápio.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Gerenciar Cardápio</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="ml-4 text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Gerenciar Cardápio</h3>
          <p className="text-gray-600">Restaurante: {selectedRestaurant.name}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <MenuItemForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingItem={editingItem}
      />

      {categories.length > 0 ? (
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-4">{category}</h4>
              <div className="grid gap-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <MenuEmptyState onCreateFirst={handleOpenNewItemDialog} />
      )}
    </div>
  );
};

export default MenuManagement;
