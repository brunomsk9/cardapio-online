
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

interface RestaurantsEmptyStateProps {
  onCreateFirst: () => void;
}

const RestaurantsEmptyState = ({ onCreateFirst }: RestaurantsEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum restaurante encontrado
      </h3>
      <p className="text-gray-500 mb-4">
        Comece criando seu primeiro restaurante.
      </p>
      <Button onClick={onCreateFirst}>
        Criar Primeiro Restaurante
      </Button>
    </div>
  );
};

export default RestaurantsEmptyState;
