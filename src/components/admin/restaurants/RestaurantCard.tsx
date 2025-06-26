
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Phone, Mail, MapPin, Globe, Edit, Trash2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
  onToggleStatus: (restaurant: Restaurant) => void;
}

const RestaurantCard = ({ restaurant, onEdit, onDelete, onToggleStatus }: RestaurantCardProps) => {
  return (
    <Card key={restaurant.id} className="bg-koombo-white border-koombo-graphite">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-3">
              <div className="bg-koombo-orange/10 p-2 rounded-full">
                <Building2 className="h-4 w-4 text-koombo-orange" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-koombo-graphite">{restaurant.name}</h4>
                {restaurant.description && (
                  <p className="text-koombo-graphite/70 text-sm">{restaurant.description}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {restaurant.subdomain && (
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-koombo-graphite/50" />
                  <span className="text-koombo-orange">{restaurant.subdomain}.koombo.online</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center text-sm text-koombo-graphite">
                  <Phone className="h-4 w-4 mr-2 text-koombo-graphite/50" />
                  {restaurant.phone}
                </div>
              )}
              {restaurant.email && (
                <div className="flex items-center text-sm text-koombo-graphite">
                  <Mail className="h-4 w-4 mr-2 text-koombo-graphite/50" />
                  {restaurant.email}
                </div>
              )}
              {restaurant.address && (
                <div className="flex items-center text-sm text-koombo-graphite">
                  <MapPin className="h-4 w-4 mr-2 text-koombo-graphite/50" />
                  {restaurant.address}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 flex flex-col items-end">
            <Badge variant={restaurant.is_active ? "default" : "secondary"} 
                   className={restaurant.is_active ? 
                     "bg-koombo-orange text-koombo-white" : 
                     "bg-koombo-graphite/20 text-koombo-graphite"
                   }>
              {restaurant.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(restaurant)}
                className="border-koombo-graphite text-koombo-graphite hover:bg-koombo-white/50"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant={restaurant.is_active ? "outline" : "default"}
                size="sm"
                onClick={() => onToggleStatus(restaurant)}
                className={restaurant.is_active ? 
                  "border-koombo-graphite text-koombo-graphite hover:bg-koombo-white/50" : 
                  "bg-koombo-orange text-koombo-white hover:bg-koombo-orange/90"
                }
              >
                {restaurant.is_active ? 'Desativar' : 'Ativar'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(restaurant)}
                className="bg-koombo-orange text-koombo-white hover:bg-koombo-orange/90"
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

export default RestaurantCard;
