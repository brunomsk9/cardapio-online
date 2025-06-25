
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, UtensilsCrossed } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  available: boolean;
  image_url?: string | null;
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) => {
  const handleDelete = () => {
    if (!confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      return;
    }
    onDelete(item);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <UtensilsCrossed className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h5 className="font-semibold">{item.name}</h5>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
                <p className="text-lg font-bold text-orange-600">
                  R$ {item.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <Badge variant={item.available ? "default" : "secondary"}>
              {item.available ? 'Disponível' : 'Indisponível'}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant={item.available ? "secondary" : "default"}
                size="sm"
                onClick={() => onToggleAvailability(item)}
              >
                {item.available ? 'Desabilitar' : 'Habilitar'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
