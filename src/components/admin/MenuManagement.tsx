
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import MenuItemForm from './MenuItemForm';
import MenuEmptyState from './MenuEmptyState';
import MenuHeader from './menu/MenuHeader';
import MenuCategories from './menu/MenuCategories';
import MenuEmptyMessage from './menu/MenuEmptyMessage';
import MenuLoadingState from './menu/MenuLoadingState';

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
    return <MenuEmptyMessage />;
  }

  if (loading) {
    return <MenuLoadingState />;
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      <MenuHeader 
        restaurantName={selectedRestaurant.name}
        isDialogOpen={isDialogOpen}
        onDialogChange={setIsDialogOpen}
      />

      <MenuItemForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingItem={editingItem}
      />

      {categories.length > 0 ? (
        <MenuCategories
          categories={categories}
          menuItems={menuItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleAvailability={handleToggleAvailability}
        />
      ) : (
        <MenuEmptyState onCreateFirst={handleOpenNewItemDialog} />
      )}
    </div>
  );
};

export default MenuManagement;
