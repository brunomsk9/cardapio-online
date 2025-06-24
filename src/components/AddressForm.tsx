
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { MapPin, Search } from 'lucide-react';

interface AddressData {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressFormProps {
  onSubmit: (address: AddressData) => void;
  loading?: boolean;
}

const AddressForm = ({ onSubmit, loading = false }: AddressFormProps) => {
  const [address, setAddress] = useState<AddressData>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'São Paulo',
    zipCode: ''
  });
  const [cepLoading, setCepLoading] = useState(false);

  const formatCep = (cep: string) => {
    const numericCep = cep.replace(/\D/g, '');
    return numericCep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    if (formatted.length <= 9) {
      setAddress(prev => ({ ...prev, zipCode: formatted }));
    }
  };

  const searchAddressByCep = async () => {
    const cep = address.zipCode.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Digite um CEP válido com 8 dígitos",
        variant: "destructive",
      });
      return;
    }

    setCepLoading(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado e tente novamente",
          variant: "destructive",
        });
        return;
      }

      setAddress(prev => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || 'São Paulo'
      }));

      toast({
        title: "Endereço encontrado!",
        description: "Os dados foram preenchidos automaticamente",
      });

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!address.zipCode || !address.street || !address.number || !address.neighborhood || !address.city) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onSubmit(address);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereço de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                type="text"
                value={address.zipCode}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={searchAddressByCep}
                disabled={cepLoading || address.zipCode.replace(/\D/g, '').length !== 8}
                className="px-3"
              >
                {cepLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="street">Logradouro *</Label>
            <Input
              id="street"
              type="text"
              value={address.street}
              onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
              placeholder="Rua, Avenida, etc."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                type="text"
                value={address.number}
                onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}
                placeholder="123"
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                type="text"
                value={address.complement}
                onChange={(e) => setAddress(prev => ({ ...prev, complement: e.target.value }))}
                placeholder="Apto, Bloco, etc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              type="text"
              value={address.neighborhood}
              onChange={(e) => setAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
              placeholder="Nome do bairro"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                type="text"
                value={address.city}
                onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Nome da cidade"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                type="text"
                value={address.state}
                onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Estado"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Endereço'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
