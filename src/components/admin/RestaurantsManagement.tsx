
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Building2, Plus, Edit, Trash2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

const RestaurantsManagement = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      logo_url: '',
      subdomain: ''
    }
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRestaurants(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar restaurantes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubdomainChange = (value: string) => {
    // Permitir apenas letras minúsculas, números e hífens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return sanitized;
  };

  const handleSubmit = async (data: RestaurantFormData) => {
    try {
      if (editingRestaurant) {
        const { error } = await supabase
          .from('restaurants')
          .update({
            name: data.name,
            description: data.description || null,
            address: data.address || null,
            phone: data.phone || null,
            email: data.email || null,
            logo_url: data.logo_url || null,
            subdomain: data.subdomain,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingRestaurant.id);

        if (error) {
          if (error.code === '23505' && error.message.includes('subdomain')) {
            throw new Error('Este subdomínio já está sendo usado por outro restaurante. Escolha um diferente.');
          }
          throw error;
        }

        toast({
          title: "Restaurante atualizado!",
          description: "As informações foram atualizadas com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('restaurants')
          .insert({
            name: data.name,
            description: data.description || null,
            address: data.address || null,
            phone: data.phone || null,
            email: data.email || null,
            logo_url: data.logo_url || null,
            subdomain: data.subdomain
          });

        if (error) {
          if (error.code === '23505' && error.message.includes('subdomain')) {
            throw new Error('Este subdomínio já está sendo usado por outro restaurante. Escolha um diferente.');
          }
          throw error;
        }

        toast({
          title: "Restaurante criado!",
          description: "O restaurante foi adicionado com sucesso.",
        });
      }

      fetchRestaurants();
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar restaurante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (restaurant: Restaurant) => {
    if (!confirm(`Tem certeza que deseja excluir o restaurante "${restaurant.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurant.id);

      if (error) throw error;

      toast({
        title: "Restaurante excluído!",
        description: "O restaurante foi removido com sucesso.",
      });

      fetchRestaurants();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir restaurante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (restaurant: Restaurant) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ 
          is_active: !restaurant.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', restaurant.id);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Restaurante ${restaurant.is_active ? 'desativado' : 'ativado'} com sucesso.`,
      });

      fetchRestaurants();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    form.reset({
      name: restaurant.name,
      description: restaurant.description || '',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      logo_url: restaurant.logo_url || '',
      subdomain: restaurant.subdomain || ''
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRestaurant(null);
    form.reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Restaurantes</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Restaurante
            </Button>
          </DialogTrigger>
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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Building2 className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{restaurant.name}</h4>
                      {restaurant.description && (
                        <p className="text-gray-600 text-sm">{restaurant.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {restaurant.subdomain && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-blue-600">{restaurant.subdomain}.koombo.online</span>
                      </div>
                    )}
                    {restaurant.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {restaurant.phone}
                      </div>
                    )}
                    {restaurant.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        {restaurant.email}
                      </div>
                    )}
                    {restaurant.address && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {restaurant.address}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 flex flex-col items-end">
                  <Badge variant={restaurant.is_active ? "default" : "secondary"}>
                    {restaurant.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(restaurant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={restaurant.is_active ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(restaurant)}
                    >
                      {restaurant.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(restaurant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum restaurante encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando seu primeiro restaurante.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Criar Primeiro Restaurante
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantsManagement;
