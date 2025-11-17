
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
    <>
      <FormField
        control={control}
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
        control={control}
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
          control={control}
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
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
      <FormField
        control={control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da Imagem</FormLabel>
            <FormControl>
              <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              Dimensões recomendadas: 800 x 600 pixels (4:3) ou 800 x 800 pixels (quadrada)
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MenuItemFormFields;
