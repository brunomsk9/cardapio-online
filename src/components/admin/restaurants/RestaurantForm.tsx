
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';

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

  const handleSubdomainChange = (value: string) => {
    // Permitir apenas letras minúsculas, números e hífens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return sanitized;
  };

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do restaurante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdomínio *</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="meurestaurante" 
                        {...field}
                        onChange={(e) => {
                          const sanitized = handleSubdomainChange(e.target.value);
                          field.onChange(sanitized);
                        }}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">.koombo.online</span>
                    </div>
                  </FormControl>
                  <div className="text-xs text-gray-500">
                    <p>Apenas letras minúsculas, números e hífens são permitidos</p>
                    {field.value && (
                      <p className="text-blue-600 mt-1">
                        Será acessível em: <strong>{field.value}.koombo.online</strong>
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição do restaurante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contato@restaurante.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço completo do restaurante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Logo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
