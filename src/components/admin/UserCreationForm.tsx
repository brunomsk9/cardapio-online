
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, X } from 'lucide-react';
import { useUserCreationForm } from '@/hooks/useUserCreationForm';
import { UserCreationWarning } from './UserCreationWarning';
import { UserCreationFormFields } from './UserCreationFormFields';

interface UserCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const UserCreationForm = ({ isOpen, onClose, onUserCreated }: UserCreationFormProps) => {
  const { formData, loading, handleSubmit, handleInputChange } = useUserCreationForm({
    onUserCreated,
    onClose
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-koombo-white border-koombo-graphite">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-koombo-graphite">
            <UserPlus className="h-5 w-5" />
            Criar Novo Usuário
          </DialogTitle>
          <DialogDescription className="text-koombo-graphite/70">
            Preencha os dados para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        <UserCreationWarning />

        <form onSubmit={handleSubmit} className="space-y-4">
          <UserCreationFormFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-koombo-orange hover:bg-koombo-orange/90 text-koombo-white"
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-koombo-graphite text-koombo-graphite hover:bg-koombo-white/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreationForm;
