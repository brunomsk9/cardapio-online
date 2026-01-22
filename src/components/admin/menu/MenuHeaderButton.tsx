import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MenuHeaderProps {
  restaurantName: string;
  isDialogOpen: boolean;
  onDialogChange: (open: boolean) => void;
}

const MenuHeader = ({ restaurantName, isDialogOpen, onDialogChange }: MenuHeaderProps) => {
  // Evita que TS/lint reclamem de prop não usada enquanto mantemos a API do componente.
  // (A API é usada pelo pai: <MenuHeader isDialogOpen={...} />)
  void isDialogOpen;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold">Gerenciar Cardápio</h3>
        <p className="text-gray-600">Restaurante: {restaurantName}</p>
      </div>

      <Button
        type="button"
        onClick={() => onDialogChange(true)}
        className="bg-gradient-to-r from-orange-500 to-orange-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Novo Item
      </Button>
    </div>
  );
};

export default MenuHeader;
