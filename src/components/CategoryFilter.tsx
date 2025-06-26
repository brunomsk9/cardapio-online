
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
              ? 'bg-koombo-branco hover:bg-koombo-branco/90 text-koombo-grafite border-koombo-branco font-semibold'
              : 'hover:bg-koombo-branco/20 border-koombo-branco text-koombo-branco hover:text-koombo-branco font-medium'
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
