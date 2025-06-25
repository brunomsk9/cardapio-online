
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import { RestaurantFormData } from './restaurantSchema';

interface RestaurantFormFieldsProps {
  control: Control<RestaurantFormData>;
}

const RestaurantFormFields = ({ control }: RestaurantFormFieldsProps) => {
  return (
    <div className="space-y-3">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Nome *</FormLabel>
            <FormControl>
              <Input placeholder="Nome do restaurante" className="h-9" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" className="h-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@exemplo.com" className="h-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Endereço completo" className="h-9" {...field} />
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
            <FormLabel className="text-sm font-medium">Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descrição breve do restaurante" 
                className="min-h-[60px] resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="subdomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Subdomínio</FormLabel>
              <FormControl>
                <Input placeholder="meurestaurante" className="h-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">URL do Logo</FormLabel>
              <FormControl>
                <Input placeholder="https://..." className="h-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RestaurantFormFields;
