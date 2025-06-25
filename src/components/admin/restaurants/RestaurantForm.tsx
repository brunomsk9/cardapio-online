
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';
import RestaurantFormFields from './RestaurantFormFields';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

const restaurantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  logo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  subdomain: z.string().min(1, 'Subdomínio é obrigatório').regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens são permitidos')
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

interface RestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
  editingRestaurant: Restaurant | null;
}

const RestaurantForm = ({ isOpen, onClose, onSubmit, editingRestaurant }: RestaurantFormProps) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: editingRestaurant?.name || '',
      description: editingRestaurant?.description || '',
      address: editingRestaurant?.address || '',
      phone: editingRestaurant?.phone || '',
      email: editingRestaurant?.email || '',
      logo_url: editingRestaurant?.logo_url || '',
      subdomain: editingRestaurant?.subdomain || ''
    }
  });

  const handleFormSubmit = async (data: RestaurantFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingRestaurant ? 'Editar Restaurante' : 'Novo Restaurante'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do restaurante abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <RestaurantFormFields form={form} />
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                {editingRestaurant ? 'Atualizar' : 'Criar'} Restaurante
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantForm;
