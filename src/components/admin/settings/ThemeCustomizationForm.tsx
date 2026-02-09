
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Save, RefreshCw, Palette, Upload, X, Loader2, Image, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { removeBackground } from '@imgly/background-removal';

interface ThemeCustomizationFormProps {
  formData: {
    primary_color: string;
    secondary_color: string;
    hero_image_url: string;
    logo_url: string;
    logo_size: number;
  };
  restaurantId: string;
  saving: boolean;
  onInputChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DEFAULT_PRIMARY_COLOR = '#FF521D';
const DEFAULT_SECONDARY_COLOR = '#282828';

const ThemeCustomizationForm = ({ formData, restaurantId, saving, onInputChange, onSubmit }: ThemeCustomizationFormProps) => {
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const resetToDefaults = () => {
    onInputChange('primary_color', DEFAULT_PRIMARY_COLOR);
    onInputChange('secondary_color', DEFAULT_SECONDARY_COLOR);
  };

  const handleHeroUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingHero(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${restaurantId}/hero-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('restaurant-images')
        .getPublicUrl(data.path);

      onInputChange('hero_image_url', urlData.publicUrl);

      toast({
        title: "Imagem enviada!",
        description: "A imagem hero foi enviada com sucesso.",
      });
    } catch (error: any) {
      console.error('Error uploading hero image:', error);
      toast({
        title: "Erro ao enviar imagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingHero(false);
      if (heroFileInputRef.current) {
        heroFileInputRef.current.value = '';
      }
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate PNG format for transparency
    if (file.type !== 'image/png') {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos PNG para manter a transparência.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A logo deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);

    try {
      const fileName = `${restaurantId}/logo-${Date.now()}.png`;

      const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('restaurant-images')
        .getPublicUrl(data.path);

      onInputChange('logo_url', urlData.publicUrl);

      toast({
        title: "Logo enviada!",
        description: "A logo foi enviada com sucesso.",
      });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erro ao enviar logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveHeroImage = () => {
    onInputChange('hero_image_url', '');
  };

  const handleRemoveLogo = () => {
    onInputChange('logo_url', '');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Cores do Tema */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Cores do Tema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Cor Principal (Botões, Destaques)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color || DEFAULT_PRIMARY_COLOR}
                onChange={(e) => onInputChange('primary_color', e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.primary_color || DEFAULT_PRIMARY_COLOR}
                onChange={(e) => onInputChange('primary_color', e.target.value)}
                placeholder="#FF521D"
                className="flex-1"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            <p className="text-xs text-gray-500">
              Usada em botões, badges e elementos de destaque
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondary_color">Cor Secundária (Fundo, Header)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="secondary_color"
                type="color"
                value={formData.secondary_color || DEFAULT_SECONDARY_COLOR}
                onChange={(e) => onInputChange('secondary_color', e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.secondary_color || DEFAULT_SECONDARY_COLOR}
                onChange={(e) => onInputChange('secondary_color', e.target.value)}
                placeholder="#282828"
                className="flex-1"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            <p className="text-xs text-gray-500">
              Usada no header e fundos escuros
            </p>
          </div>
        </div>

        {/* Preview das cores */}
        <div className="p-4 rounded-lg border bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">Pré-visualização:</p>
          <div className="flex items-center gap-4">
            <div 
              className="w-24 h-12 rounded-lg shadow-sm flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: formData.secondary_color || DEFAULT_SECONDARY_COLOR }}
            >
              Header
            </div>
            <div 
              className="px-4 py-2 rounded-lg shadow-sm text-white text-sm font-medium"
              style={{ backgroundColor: formData.primary_color || DEFAULT_PRIMARY_COLOR }}
            >
              Botão
            </div>
            <span 
              className="text-sm font-medium"
              style={{ color: formData.primary_color || DEFAULT_PRIMARY_COLOR }}
            >
              Texto Destaque
            </span>
          </div>
        </div>
      </div>

      {/* Logo do Restaurante */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          <Image className="h-4 w-4" />
          Logo do Restaurante
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={logoFileInputRef}
            type="file"
            accept="image/png"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => logoFileInputRef.current?.click()}
            disabled={uploadingLogo}
            className="flex items-center gap-2"
          >
            {uploadingLogo ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Logo PNG
              </>
            )}
          </Button>
          
          {formData.logo_url && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveLogo}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remover Logo
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Use apenas arquivos PNG com fundo transparente. Tamanho máximo: 2MB.
        </p>

        {/* Slider de Tamanho da Logo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="logo_size">Tamanho da Logo</Label>
            <span className="text-sm text-muted-foreground">{formData.logo_size || 120}px</span>
          </div>
          <Slider
            id="logo_size"
            value={[formData.logo_size || 120]}
            onValueChange={(value) => onInputChange('logo_size', value[0])}
            min={40}
            max={200}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>40px</span>
            <span>200px</span>
          </div>
        </div>
        
        {formData.logo_url && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-2">Pré-visualização:</p>
            <div 
              className="inline-flex items-center justify-center p-4 rounded-lg border bg-muted/50"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            >
              <img 
                src={formData.logo_url} 
                alt="Preview da logo"
                style={{ 
                  width: `${formData.logo_size || 120}px`,
                  height: 'auto'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Imagem da Home */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Imagem da Home (Hero)
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleHeroUpload}
            className="hidden"
            id="hero-image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => heroFileInputRef.current?.click()}
            disabled={uploadingHero}
            className="flex items-center gap-2"
          >
            {uploadingHero ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Fazer Upload de Imagem
              </>
            )}
          </Button>
          
          {formData.hero_image_url && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveHeroImage}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remover Imagem
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero_image_url" className="text-sm text-muted-foreground">
            Ou insira uma URL de imagem:
          </Label>
          <Input
            id="hero_image_url"
            type="url"
            value={formData.hero_image_url || ''}
            onChange={(e) => onInputChange('hero_image_url', e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Recomendado: 800x600 pixels ou proporção 4:3. Tamanho máximo: 5MB.
        </p>
        
        {formData.hero_image_url && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-2">Pré-visualização:</p>
            <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border bg-muted">
              <img 
                src={formData.hero_image_url} 
                alt="Preview da imagem hero"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar Personalização'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={resetToDefaults}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Restaurar Padrão
        </Button>
      </div>
    </form>
  );
};

export default ThemeCustomizationForm;
