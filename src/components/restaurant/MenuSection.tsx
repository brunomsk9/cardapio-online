
import { useState } from 'react';
import { Database } from '@/integrations/supabase/types';
import MenuCard from '@/components/MenuCard';
import CategoryFilter from '@/components/CategoryFilter';
import { MenuItem } from '@/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface MenuSectionProps {
  restaurant: Restaurant | null;
  menuItems: MenuItem[];
  cart: any[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const MenuSection = ({ restaurant, menuItems, cart, onAddToCart, onUpdateQuantity }: MenuSectionProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'entrada', label: 'Entradas' },
    { key: 'principal', label: 'Pratos Principais' },
    { key: 'bebida', label: 'Bebidas' },
    { key: 'sobremesa', label: 'Sobremesas' }
  ];

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  // Helper function to get cart quantity for an item
  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <section id="cardapio" className="bg-koombo-laranja py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-koombo-branco mb-4">
            NOSSO <span className="text-koombo-grafite">CARDÁPIO</span>
          </h2>
          <p className="text-lg text-koombo-branco/90 font-medium">
            Escolha entre nossos deliciosos pratos e sabores únicos
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={() => onAddToCart(item)}
                cartQuantity={getCartQuantity(item.id)}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-koombo-branco rounded-xl p-8 shadow-lg max-w-md mx-auto border border-gray-200">
              <p className="text-koombo-grafite text-lg font-semibold mb-2">
                {restaurant 
                  ? `${restaurant.name} ainda não possui itens no cardápio.`
                  : 'Nenhum item encontrado nesta categoria.'
                }
              </p>
              <p className="text-koombo-grafite/60">
                Volte em breve para conferir nossas novidades!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
