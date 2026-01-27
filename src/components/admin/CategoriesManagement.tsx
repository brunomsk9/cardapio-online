import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useMenuCategories } from '@/hooks/useMenuCategories';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CategoriesManagement = () => {
  const { categories, loading, createCategory, deleteCategory, refetch } = useMenuCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleToggleVisibility = async (categoryId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .update({ visible_on_menu: !currentVisibility })
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: currentVisibility ? "Categoria oculta" : "Categoria visível",
        description: currentVisibility 
          ? "A categoria não aparecerá mais na página inicial." 
          : "A categoria agora aparece na página inicial.",
      });

      refetch();
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      toast({
        title: "Erro ao alterar visibilidade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    await createCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleDeleteClick = (categoryId: string, isSystemDefault: boolean) => {
    if (isSystemDefault) {
      return; // Don't allow deleting system defaults
    }
    setCategoryToDelete(categoryId);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return <div>Carregando categorias...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Categorias do Cardápio</CardTitle>
          <CardDescription>
            Adicione categorias personalizadas além das categorias padrão do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nome da nova categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
            <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Categorias Disponíveis:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={!category.visible_on_menu ? 'text-muted-foreground line-through' : ''}>
                      {category.name}
                    </span>
                    {category.is_system_default && (
                      <Badge variant="secondary" className="text-xs">
                        Padrão
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {category.visible_on_menu ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={category.visible_on_menu ?? true}
                        onCheckedChange={() => handleToggleVisibility(category.id, category.visible_on_menu ?? true)}
                        aria-label={category.visible_on_menu ? 'Ocultar categoria' : 'Mostrar categoria'}
                      />
                    </div>
                    {!category.is_system_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(category.id, category.is_system_default)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesManagement;