
import MenuItemCard from '../MenuItemCard';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  available: boolean;
  image_url?: string | null;
  featured?: boolean;
}

interface MenuCategoriesProps {
  categories: string[];
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
  onToggleFeatured?: (item: MenuItem) => void;
}

const MenuCategories = ({ 
  categories, 
  menuItems, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  onToggleFeatured
}: MenuCategoriesProps) => {
  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category}>
          <h4 className="text-lg font-semibold mb-4">{category}</h4>
          <div className="grid gap-4">
            {menuItems
              .filter(item => item.category === category)
              .map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleAvailability={onToggleAvailability}
                  onToggleFeatured={onToggleFeatured}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuCategories;
