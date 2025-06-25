
import { AlertTriangle } from 'lucide-react';

export const UserCreationWarning = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">Informação importante:</p>
          <p>O usuário será criado com papel padrão (usuário) e receberá um email de confirmação. O papel pode ser alterado posteriormente na lista de usuários.</p>
        </div>
      </div>
    </div>
  );
};
