
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
              <FormLabel className="text-sm font-medium">Nome do Restaurante *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Pizzaria Bella" 
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
              <FormLabel className="text-sm font-medium">Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o estilo e especialidades do restaurante..." 
                  className="min-h-[80px] resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Contato */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Informações de Contato
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(11) 99999-9999" 
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="contato@exemplo.com" 
                    className="h-10" 
                    {...field} 
                  />
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
                <Input 
                  placeholder="Rua, número, bairro, cidade" 
                  className="h-10" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Configurações */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Configurações Online
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Subdomínio</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="meurestaurante" 
                    className="h-10" 
                    {...field} 
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  URL do site
                </p>
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
                  <Input 
                    placeholder="https://..." 
                    className="h-10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantFormFields;
