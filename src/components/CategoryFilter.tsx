
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: Array<{ key: string; label: string }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-12 justify-center">
      {categories.map((category) => (
        <Button
          key={category.key}
          variant={activeCategory === category.key ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.key)}
          className={
            activeCategory === category.key
              ? 'bg-koombo-orange hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl border-0 shadow-md'
              : 'text-koombo-graphite hover:bg-gray-50 font-medium px-6 py-3 rounded-xl border-gray-200'
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
