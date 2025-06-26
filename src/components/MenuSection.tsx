
import MenuCard from '@/components/MenuCard';
import CategoryFilter from '@/components/CategoryFilter';
import { MenuItem } from '@/types';

interface MenuSectionProps {
  categories: Array<{ key: string; label: string }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  menuItems: MenuItem[];
  filteredItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  restaurantName?: string;
}

const MenuSection = ({
  categories,
  activeCategory,
  onCategoryChange,
  filteredItems,
  onAddToCart,
  restaurantName
}: MenuSectionProps) => {
  return (
    <section className="container mx-auto py-16 px-6">
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={() => onAddToCart(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="bg-koombo-white rounded-2xl p-12 max-w-md mx-auto">
            <p className="text-koombo-graphite text-lg font-medium">
              {restaurantName 
                ? `${restaurantName} ainda não possui itens no cardápio.`
                : 'Nenhum item encontrado nesta categoria.'
              }
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
