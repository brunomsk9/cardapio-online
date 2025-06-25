
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface RestaurantFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  subdomain: string;
}

interface RestaurantFormFieldsProps {
  form: UseFormReturn<RestaurantFormData>;
}

const RestaurantFormFields = ({ form }: RestaurantFormFieldsProps) => {
  const handleSubdomainChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return sanitized;
  };

  return (
    <>
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
    </>
  );
};

export default RestaurantFormFields;
