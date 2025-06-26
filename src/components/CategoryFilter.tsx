
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: Array<{ key: string; label: string }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {categories.map((category) => (
        <Button
          key={category.key}
          variant={activeCategory === category.key ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.key)}
          className={
            activeCategory === category.key
              ? 'bg-koombo-laranja hover:bg-koombo-laranja/90 text-white border-koombo-laranja font-semibold shadow-lg'
              : 'bg-white hover:bg-koombo-laranja/10 border-koombo-laranja text-koombo-laranja hover:text-koombo-laranja font-medium shadow-md'
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
