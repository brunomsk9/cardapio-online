
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface UserCreationFormFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export const UserCreationFormFields = ({ formData, onInputChange }: UserCreationFormFieldsProps) => {
  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Informações Pessoais
        </h3>
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">Nome Completo *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            placeholder="Ex: João Silva Santos"
            className="h-10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
            className="h-10"
          />
        </div>
      </div>

      {/* Credenciais de Acesso */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Credenciais de Acesso
        </h3>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="usuario@email.com"
            className="h-10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Senha *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="h-10"
            minLength={6}
            required
          />
          <p className="text-xs text-muted-foreground">
            A senha deve ter no mínimo 6 caracteres
          </p>
        </div>
      </div>
    </div>
  );
};
