
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { MenuItemFormData } from './menuItemSchema';
import { useMenuCategories } from '@/hooks/useMenuCategories';

interface MenuItemFormFieldsProps {
  control: Control<MenuItemFormData>;
}

const MenuItemFormFields = ({ control }: MenuItemFormFieldsProps) => {
  const { categories } = useMenuCategories();

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Informações Básicas
        </h3>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Nome do Item *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Hambúrguer Artesanal" 
                  className="h-10"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Descrição *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os ingredientes e características do prato..." 
                  className="min-h-[80px] resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Preço e Categoria */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Classificação
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Preço *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="h-10"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Categoria *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Imagem */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Imagem do Produto
        </h3>
        <FormField
          control={control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">URL da Imagem</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://exemplo.com/imagem.jpg" 
                  className="h-10"
                  {...field} 
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1.5">
                📐 Dimensões recomendadas: 800 x 600 pixels (4:3) ou 800 x 800 pixels (quadrada)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default MenuItemFormFields;
