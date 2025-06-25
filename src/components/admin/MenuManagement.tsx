
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';

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

const menuItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  image_url: z.string().url('URL inválida').optional().or(z.literal(''))
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleSubmit = async (data: MenuItemFormData) => {
    try {
      if (editingItem) {
        // Atualizar item existente
        setMenuItems(items => items.map(item => 
          item.id === editingItem.id 
            ? { ...item, ...data }
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
          ...data,
          available: true
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
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    if (!confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      return;
    }

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
    form.reset();
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descrição do item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Pratos Principais" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingItem ? 'Atualizar' : 'Criar'} Item
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

      {categories.length > 0 ? (
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-4">{category}</h4>
              <div className="grid gap-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="bg-orange-100 p-2 rounded-full">
                                <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <h5 className="font-semibold">{item.name}</h5>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-lg font-bold text-orange-600">
                                  R$ {item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 flex flex-col items-end">
                            <Badge variant={item.available ? "default" : "secondary"}>
                              {item.available ? 'Disponível' : 'Indisponível'}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={item.available ? "secondary" : "default"}
                                size="sm"
                                onClick={() => toggleAvailability(item)}
                              >
                                {item.available ? 'Desabilitar' : 'Habilitar'}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(item)}
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum item no cardápio
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando seu primeiro item do cardápio.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Criar Primeiro Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
