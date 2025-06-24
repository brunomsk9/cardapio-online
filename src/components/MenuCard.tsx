
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  cartQuantity?: number;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

const categoryLabels = {
  entrada: 'Entrada',
  principal: 'Prato Principal',
  bebida: 'Bebida',
  sobremesa: 'Sobremesa'
};

const MenuCard = ({ item, onAddToCart, cartQuantity = 0, onUpdateQuantity }: MenuCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:scale-105 transform">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <Badge className="absolute top-2 right-2 bg-orange-500">
          {categoryLabels[item.category]}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            R$ {item.price.toFixed(2)}
          </span>
          {!item.available && (
            <Badge variant="destructive">Indisponível</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        {item.available ? (
          <div className="flex items-center justify-between w-full">
            {cartQuantity > 0 ? (
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity?.(item.id, cartQuantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold">{cartQuantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity?.(item.id, cartQuantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(item)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            )}
          </div>
        ) : (
          <Button disabled className="w-full">
            Indisponível
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
