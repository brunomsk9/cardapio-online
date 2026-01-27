
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import MenuItemForm from './MenuItemForm';
import MenuEmptyState from './MenuEmptyState';
import MenuHeader from './menu/MenuHeaderButton';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Mantém o modal aberto ao trocar de aba (algumas sessões acabam remontando /admin)
  // e também preserva qual item estava em edição.
  const DIALOG_OPEN_KEY = 'admin_menu_item_dialog_open';
  const EDITING_ITEM_KEY = 'admin_menu_item_editing_item';

  // Restore (once)
  useState(() => {
    try {
      const wasOpen = sessionStorage.getItem(DIALOG_OPEN_KEY) === 'true';
      if (wasOpen) {
        const raw = sessionStorage.getItem(EDITING_ITEM_KEY);
        if (raw) {
          setEditingItem(JSON.parse(raw));
        }
        setIsDialogOpen(true);
      }
    } catch {
      // ignore
    }
    return null;
  });

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

    try {
      sessionStorage.setItem(DIALOG_OPEN_KEY, 'true');
      sessionStorage.setItem(EDITING_ITEM_KEY, JSON.stringify(item));
    } catch {
      // ignore
    }
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

    try {
      sessionStorage.removeItem(DIALOG_OPEN_KEY);
      sessionStorage.removeItem(EDITING_ITEM_KEY);
    } catch {
      // ignore
    }
  };

  const handleOpenNewItemDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);

    try {
      sessionStorage.setItem(DIALOG_OPEN_KEY, 'true');
      sessionStorage.removeItem(EDITING_ITEM_KEY);
    } catch {
      // ignore
    }
  };

  if (!selectedRestaurant) {
    return <MenuEmptyMessage />;
  }

  if (loading) {
    return <MenuLoadingState />;
  }

  // Filter items based on search query
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(filteredItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      <MenuHeader 
        restaurantName={selectedRestaurant.name}
        isDialogOpen={isDialogOpen}
        onDialogChange={setIsDialogOpen}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar itens do cardápio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <MenuItemForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingItem={editingItem}
      />

      {categories.length > 0 ? (
        <MenuCategories
          categories={categories}
          menuItems={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleAvailability={handleToggleAvailability}
        />
      ) : searchQuery ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum item encontrado para "{searchQuery}"</p>
        </div>
      ) : (
        <MenuEmptyState onCreateFirst={handleOpenNewItemDialog} />
      )}
    </div>
  );
};

export default MenuManagement;
