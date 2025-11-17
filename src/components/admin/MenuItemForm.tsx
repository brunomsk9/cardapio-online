
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { menuItemSchema, MenuItemFormData } from './menu/menuItemSchema';
import MenuItemFormFields from './menu/MenuItemFormFields';
import MenuItemFormActions from './menu/MenuItemFormActions';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  const [showCloseAlert, setShowCloseAlert] = React.useState(false);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      image_url: ''
    }
  });

  const { clearSavedData, hasUnsavedData } = useFormPersistence({
    formKey: editingItem ? `menu_item_edit_${editingItem.id}` : 'menu_item_new',
    form,
    enabled: isOpen && !editingItem // Only persist for new items
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
    } else if (!isOpen) {
      // Reset form when closing if no editing
      form.reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: ''
      });
    }
  }, [editingItem, isOpen, form]);

  const handleSubmit = (data: MenuItemFormData) => {
    onSubmit(data);
    clearSavedData();
    form.reset();
  };

  const handleClose = () => {
    if (!editingItem && hasUnsavedData()) {
      setShowCloseAlert(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    clearSavedData();
    form.reset();
    setShowCloseAlert(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Item' : 'Novo Item do Cardápio'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do item do cardápio.
              {!editingItem && ' Seus dados serão salvos automaticamente.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <MenuItemFormFields control={form.control} />
              <MenuItemFormActions 
                isEditing={!!editingItem} 
                onCancel={handleClose} 
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem dados não salvos. Se fechar agora, todas as informações preenchidas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose} className="bg-destructive hover:bg-destructive/90">
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MenuItemForm;
