
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, RefreshCw, Palette } from 'lucide-react';

interface ThemeCustomizationFormProps {
  formData: {
    primary_color: string;
    secondary_color: string;
    hero_image_url: string;
  };
  saving: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DEFAULT_PRIMARY_COLOR = '#FF521D';
const DEFAULT_SECONDARY_COLOR = '#282828';

const ThemeCustomizationForm = ({ formData, saving, onInputChange, onSubmit }: ThemeCustomizationFormProps) => {
  const resetToDefaults = () => {
    onInputChange('primary_color', DEFAULT_PRIMARY_COLOR);
    onInputChange('secondary_color', DEFAULT_SECONDARY_COLOR);
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

      {/* Imagem da Home */}
      <div className="space-y-2">
        <Label htmlFor="hero_image_url">Imagem da Home (Hero)</Label>
        <Input
          id="hero_image_url"
          type="url"
          value={formData.hero_image_url || ''}
          onChange={(e) => onInputChange('hero_image_url', e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
        <p className="text-xs text-gray-500">
          URL da imagem que aparecerá na seção principal da página do restaurante. 
          Recomendado: 800x600 pixels ou proporção 4:3.
        </p>
        
        {formData.hero_image_url && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Pré-visualização:</p>
            <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border bg-gray-100">
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
