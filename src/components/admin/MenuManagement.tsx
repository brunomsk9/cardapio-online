
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MenuItemForm from './MenuItemForm';
import MenuItemCard from './MenuItemCard';
import MenuEmptyState from './MenuEmptyState';

// Por enquanto vamos usar um estado local para itens do menu
// Posteriormente será integrado com Supabase
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image_url?: string;
}

type MenuItemFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
};

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (data: MenuItemFormData) => {
    try {
      if (editingItem) {
        // Atualizar item existente
        setMenuItems(items => items.map(item => 
          item.id === editingItem.id 
            ? { 
                ...item, 
                name: data.name,
                description: data.description,
                price: data.price,
                category: data.category,
                image_url: data.image_url || undefined
              }
            : item
        ));
        toast({
          title: "Item atualizado!",
          description: "O item do cardápio foi atualizado com sucesso.",
        });
      } else {
        // Criar novo item
        const newItem: MenuItem = {
          id: Date.now().toString(),
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          available: true,
          image_url: data.image_url || undefined
        };
        setMenuItems(items => [...items, newItem]);
        toast({
          title: "Item criado!",
          description: "O novo item foi adicionado ao cardápio.",
        });
      }

      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    setMenuItems(items => items.filter(i => i.id !== item.id));
    toast({
      title: "Item removido!",
      description: "O item foi removido do cardápio.",
    });
  };

  const toggleAvailability = (item: MenuItem) => {
    setMenuItems(items => items.map(i => 
      i.id === item.id 
        ? { ...i, available: !i.available }
        : i
    ));
    toast({
      title: "Disponibilidade atualizada!",
      description: `Item ${item.available ? 'desabilitado' : 'habilitado'}.`,
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleOpenNewItemDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Cardápio</h3>
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
                      onToggleAvailability={toggleAvailability}
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
