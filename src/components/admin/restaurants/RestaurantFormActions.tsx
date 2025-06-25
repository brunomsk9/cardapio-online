
import { Button } from '@/components/ui/button';

interface RestaurantFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const RestaurantFormActions = ({ isEditing, onCancel }: RestaurantFormActionsProps) => {
  return (
    <div className="flex gap-2 pt-2 border-t">
      <Button type="submit" className="flex-1 h-9">
        {isEditing ? 'Atualizar' : 'Criar'}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9">
        Cancelar
      </Button>
    </div>
  );
};

export default RestaurantFormActions;
