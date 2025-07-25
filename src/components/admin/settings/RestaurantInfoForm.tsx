
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface RestaurantInfoFormProps {
  formData: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    subdomain: string;
  };
  saving: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RestaurantInfoForm = ({ formData, saving, onInputChange, onSubmit }: RestaurantInfoFormProps) => {
  const handleSubdomainChange = (value: string) => {
    // Permitir apenas letras minúsculas, números e hífens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onInputChange('subdomain', sanitized);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Restaurante *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Nome do restaurante"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdomínio *</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="subdomain"
            value={formData.subdomain}
            onChange={(e) => handleSubdomainChange(e.target.value)}
            placeholder="meurestaurante"
            className="flex-1"
            required
          />
          <span className="text-sm text-gray-500">.koombo.online</span>
        </div>
        <p className="text-xs text-gray-500">
          Apenas letras minúsculas, números e hífens são permitidos
        </p>
        {formData.subdomain && (
          <p className="text-sm text-blue-600">
            Seu restaurante será acessível em: <strong>{formData.subdomain}.koombo.online</strong>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="contato@restaurante.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Descrição do restaurante"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => onInputChange('address', e.target.value)}
          placeholder="Endereço completo do restaurante"
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </form>
  );
};

export default RestaurantInfoForm;
