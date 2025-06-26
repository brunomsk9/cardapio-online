
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative bg-koombo-grafite border-0 shadow-lg">
      {/* Quantity Badge - appears only when item is in cart */}
      {cartQuantity > 0 && (
        <Badge className="absolute top-3 left-3 bg-koombo-laranja text-koombo-branco font-bold text-sm z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
          {cartQuantity}
        </Badge>
      )}

      <div className="relative h-48 overflow-hidden bg-transparent">
        <img
          src={item.image_url || '/placeholder.svg'}
          alt={item.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
        />
        <Badge className="absolute top-2 right-2 bg-koombo-laranja text-koombo-branco shadow-lg">
          {categoryLabels[item.category]}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg text-koombo-branco font-bold">{item.name}</CardTitle>
        <CardDescription className="text-sm text-koombo-branco/70">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-koombo-laranja">
            R$ {item.price.toFixed(2).replace('.', ',')}
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
              <div className="flex items-center justify-between w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity?.(item.id, cartQuantity - 1)}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-10 h-10 rounded-full p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg text-koombo-branco mx-4">
                  {cartQuantity}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity?.(item.id, cartQuantity + 1)}
                  className="border-koombo-laranja text-koombo-laranja hover:bg-koombo-laranja hover:text-white w-10 h-10 rounded-full p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(item)}
                className="w-full bg-koombo-laranja hover:bg-koombo-laranja/90 text-koombo-branco rounded-xl py-3 font-semibold shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
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
