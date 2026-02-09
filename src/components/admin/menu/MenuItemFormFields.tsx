
import { useState, useRef } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Control, UseFormSetValue } from 'react-hook-form';
import { MenuItemFormData } from './menuItemSchema';
import { useMenuCategories } from '@/hooks/useMenuCategories';
import { Upload, Loader2, Wand2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { removeBackground } from '@imgly/background-removal';

interface MenuItemFormFieldsProps {
  control: Control<MenuItemFormData>;
  setValue: UseFormSetValue<MenuItemFormData>;
  restaurantId?: string;
}

const MenuItemFormFields = ({ control, setValue, restaurantId }: MenuItemFormFieldsProps) => {
  const { categories } = useMenuCategories();
  const [uploading, setUploading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !restaurantId) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Erro", description: "Selecione apenas arquivos de imagem.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erro", description: "A imagem deve ter no máximo 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${restaurantId}/menu-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('restaurant-images').getPublicUrl(data.path);
      setValue('image_url', urlData.publicUrl);
      toast({ title: "Imagem enviada!", description: "A imagem foi enviada com sucesso." });
    } catch (error: any) {
      toast({ title: "Erro ao enviar imagem", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveBg = async (currentUrl: string) => {
    if (!currentUrl || !restaurantId) return;
    setRemovingBg(true);
    try {
      toast({ title: "Processando...", description: "Removendo fundo da imagem. Isso pode levar alguns segundos." });
      const response = await fetch(currentUrl);
      const blob = await response.blob();
      const resultBlob = await removeBackground(blob, { output: { quality: 1, format: 'image/png' } });
      const fileName = `${restaurantId}/menu-nobg-${Date.now()}.png`;
      const file = new File([resultBlob], 'menu-nobg.png', { type: 'image/png' });
      const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('restaurant-images').getPublicUrl(data.path);
      setValue('image_url', urlData.publicUrl);
      toast({ title: "Fundo removido!", description: "A imagem sem fundo foi salva com sucesso." });
    } catch (error: any) {
      toast({ title: "Erro ao remover fundo", description: error.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setRemovingBg(false);
    }
  };

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
              <FormLabel className="text-sm font-medium">Imagem</FormLabel>
              
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Enviando...' : 'Upload Imagem'}
                </Button>

                {field.value && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveBg(field.value || '')}
                      disabled={removingBg}
                      className="flex items-center gap-2"
                    >
                      {removingBg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Remover Fundo
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setValue('image_url', '')}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Remover
                    </Button>
                  </>
                )}
              </div>

              <FormControl>
                <Input 
                  placeholder="https://exemplo.com/imagem.jpg" 
                  className="h-10"
                  {...field} 
                />
              </FormControl>

              {field.value && (
                <div className="mt-2">
                  <div 
                    className="inline-flex items-center justify-center p-3 rounded-lg border bg-muted/50"
                    style={{ 
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '16px 16px',
                      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                    }}
                  >
                    <img 
                      src={field.value} 
                      alt="Preview" 
                      className="max-w-[200px] max-h-[150px] object-contain rounded"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-1.5">
                📐 Recomendado: 800x600px. Use "Remover Fundo" para imagens com transparência.
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
