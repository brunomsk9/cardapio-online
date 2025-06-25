
import { Button } from '@/components/ui/button';

interface RestaurantFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const RestaurantFormActions = ({ isEditing, onCancel }: RestaurantFormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button type="submit">
        {isEditing ? 'Atualizar' : 'Criar'} Restaurante
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
};

export default RestaurantFormActions;
