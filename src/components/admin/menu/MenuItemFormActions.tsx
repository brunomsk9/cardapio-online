
import { Button } from '@/components/ui/button';

interface MenuItemFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const MenuItemFormActions = ({ isEditing, onCancel }: MenuItemFormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button type="submit">
        {isEditing ? 'Atualizar' : 'Criar'} Item
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
};

export default MenuItemFormActions;
