
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, X } from 'lucide-react';
import { useUserCreationForm } from '@/hooks/useUserCreationForm';
import { UserCreationWarning } from './UserCreationWarning';
import { UserCreationFormFields } from './UserCreationFormFields';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface UserCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const UserCreationForm = ({ isOpen, onClose, onUserCreated }: UserCreationFormProps) => {
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  
  const { 
    formData, 
    loading, 
    handleSubmit, 
    handleInputChange,
    clearSavedData,
    hasUnsavedData 
  } = useUserCreationForm({
    onUserCreated,
    onClose,
    isOpen
  });

  // Cleanup on unmount if form is not open
  useEffect(() => {
    return () => {
      if (!isOpen) {
        clearSavedData();
      }
    };
  }, [isOpen, clearSavedData]);

  const handleClose = () => {
    if (hasUnsavedData()) {
      setShowCloseAlert(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    clearSavedData();
    setShowCloseAlert(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Criar Novo Usuário
            </DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário no sistema. Seus dados serão salvos automaticamente.
            </DialogDescription>
          </DialogHeader>

          <UserCreationWarning />

          <form onSubmit={handleSubmit} className="space-y-4">
            <UserCreationFormFields 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Criando...' : 'Criar Usuário'}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem dados não salvos. Se fechar agora, todas as informações preenchidas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose} className="bg-destructive hover:bg-destructive/90">
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserCreationForm;
