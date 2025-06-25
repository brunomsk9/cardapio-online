
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { menuItemSchema, MenuItemFormData } from './menu/menuItemSchema';
import MenuItemFormFields from './menu/MenuItemFormFields';
import MenuItemFormActions from './menu/MenuItemFormActions';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  available: boolean;
  image_url?: string | null;
}

interface MenuItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => void;
  editingItem: MenuItem | null;
}

const MenuItemForm = ({ isOpen, onClose, onSubmit, editingItem }: MenuItemFormProps) => {
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: editingItem?.name || '',
      description: editingItem?.description || '',
      price: editingItem?.price || 0,
      category: editingItem?.category || '',
      image_url: editingItem?.image_url || ''
    }
  });

  React.useEffect(() => {
    if (editingItem) {
      form.reset({
        name: editingItem.name,
        description: editingItem.description || '',
        price: editingItem.price,
        category: editingItem.category,
        image_url: editingItem.image_url || ''
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: ''
      });
    }
  }, [editingItem, form]);

  const handleSubmit = (data: MenuItemFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Editar Item' : 'Novo Item do Cardápio'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do item do cardápio.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <MenuItemFormFields control={form.control} />
            <MenuItemFormActions 
              isEditing={!!editingItem} 
              onCancel={onClose} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemForm;
