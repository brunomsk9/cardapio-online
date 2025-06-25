
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface MenuHeaderProps {
  restaurantName: string;
  isDialogOpen: boolean;
  onDialogChange: (open: boolean) => void;
}

const MenuHeader = ({ restaurantName, isDialogOpen, onDialogChange }: MenuHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold">Gerenciar Cardápio</h3>
        <p className="text-gray-600">Restaurante: {restaurantName}</p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default MenuHeader;
