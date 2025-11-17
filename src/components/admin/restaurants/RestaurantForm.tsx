
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { restaurantSchema, RestaurantFormData } from './restaurantSchema';
import RestaurantFormFields from './RestaurantFormFields';
import RestaurantFormActions from './RestaurantFormActions';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  subdomain: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface RestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => void;
  editingRestaurant: Restaurant | null;
}

const RestaurantForm = ({ isOpen, onClose, onSubmit, editingRestaurant }: RestaurantFormProps) => {
  const [showCloseAlert, setShowCloseAlert] = React.useState(false);

  const getDefaultValues = (): RestaurantFormData => ({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo_url: '',
    subdomain: ''
  });

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });

  const { clearSavedData, hasUnsavedData } = useFormPersistence({
    formKey: editingRestaurant ? `restaurant_edit_${editingRestaurant.id}` : 'restaurant_new',
    form,
    enabled: isOpen && !editingRestaurant // Only persist for new restaurants
  });

  React.useEffect(() => {
    if (editingRestaurant) {
      form.reset({
        name: editingRestaurant.name,
        description: editingRestaurant.description || '',
        address: editingRestaurant.address || '',
        phone: editingRestaurant.phone || '',
        email: editingRestaurant.email || '',
        logo_url: editingRestaurant.logo_url || '',
        subdomain: editingRestaurant.subdomain || ''
      });
    } else if (!isOpen) {
      form.reset(getDefaultValues());
    }
  }, [editingRestaurant, isOpen, form]);

  const handleSubmit = (data: RestaurantFormData) => {
    onSubmit(data);
    clearSavedData();
    form.reset();
  };

  const handleClose = () => {
    if (!editingRestaurant && hasUnsavedData()) {
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
      <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
        <DialogContent 
          className="max-w-md max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg">
              {editingRestaurant ? 'Editar Restaurante' : 'Novo Restaurante'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Preencha as informações básicas do restaurante.
            </DialogDescription>
          </DialogHeader>
          
          {!editingRestaurant && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 mb-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                Seus dados são salvos automaticamente. Você pode sair e voltar sem perder informações.
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
              <RestaurantFormFields control={form.control} />
              <RestaurantFormActions 
                isEditing={!!editingRestaurant} 
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

export default RestaurantForm;
