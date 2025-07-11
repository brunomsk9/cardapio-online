
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { restaurantSchema, RestaurantFormData } from './restaurantSchema';
import RestaurantFormFields from './RestaurantFormFields';
import RestaurantFormActions from './RestaurantFormActions';

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
  const getDefaultValues = (): RestaurantFormData => ({
    name: editingRestaurant?.name || '',
    description: editingRestaurant?.description || '',
    address: editingRestaurant?.address || '',
    phone: editingRestaurant?.phone || '',
    email: editingRestaurant?.email || '',
    logo_url: editingRestaurant?.logo_url || '',
    subdomain: editingRestaurant?.subdomain || ''
  });

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });

  React.useEffect(() => {
    form.reset(getDefaultValues());
  }, [editingRestaurant, form]);

  const handleSubmit = (data: RestaurantFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">
            {editingRestaurant ? 'Editar Restaurante' : 'Novo Restaurante'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Preencha as informações básicas do restaurante.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            <RestaurantFormFields control={form.control} />
            <RestaurantFormActions 
              isEditing={!!editingRestaurant} 
              onCancel={onClose} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantForm;
