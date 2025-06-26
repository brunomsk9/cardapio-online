
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-koombo-graphite shadow-md bg-koombo-white rounded-2xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image_url || ''}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 right-4 bg-koombo-orange text-koombo-white font-medium px-3 py-1 rounded-lg border-0">
          {categoryLabels[item.category]}
        </Badge>
      </div>
      
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl font-bold text-koombo-graphite">{item.name}</CardTitle>
        <CardDescription className="text-koombo-graphite/70 text-sm leading-relaxed">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-koombo-graphite">
            R$ {item.price.toFixed(2)}
          </span>
          {!item.available && (
            <Badge variant="destructive" className="rounded-lg bg-koombo-orange text-koombo-white">Indisponível</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        {item.available ? (
          <div className="flex items-center justify-between w-full">
            {cartQuantity > 0 ? (
              <div className="flex items-center space-x-3 w-full justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity?.(item.id, cartQuantity - 1)}
                  className="rounded-xl border-koombo-graphite hover:bg-koombo-white p-2 bg-koombo-white text-koombo-graphite"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg text-koombo-graphite min-w-[2rem] text-center">{cartQuantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity?.(item.id, cartQuantity + 1)}
                  className="rounded-xl border-koombo-graphite hover:bg-koombo-white p-2 bg-koombo-white text-koombo-graphite"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(item)}
                className="w-full bg-koombo-orange hover:bg-koombo-orange/90 text-koombo-white font-medium py-3 rounded-xl border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            )}
          </div>
        ) : (
          <Button disabled className="w-full rounded-xl bg-koombo-graphite/20 text-koombo-graphite/50">
            Indisponível
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
