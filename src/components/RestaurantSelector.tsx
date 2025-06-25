
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import { Store } from 'lucide-react';

const RestaurantSelector = () => {
  const { restaurants, selectedRestaurant, selectRestaurant, hasMultipleRestaurants, loading } = useUserRestaurant();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Store className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-500">Carregando...</span>
      </div>
    );
  }

  if (!hasMultipleRestaurants && selectedRestaurant) {
    return (
      <div className="flex items-center space-x-2">
        <Store className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">{selectedRestaurant.name}</span>
      </div>
    );
  }

  if (!hasMultipleRestaurants) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Store className="h-4 w-4 text-orange-500" />
      <Select
        value={selectedRestaurant?.id || ''}
        onValueChange={(value) => {
          const restaurant = restaurants.find(r => r.id === value);
          if (restaurant) {
            selectRestaurant(restaurant);
          }
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Selecione um restaurante" />
        </SelectTrigger>
        <SelectContent>
          {restaurants.map((restaurant) => (
            <SelectItem key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RestaurantSelector;
