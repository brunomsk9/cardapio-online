
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
              ? 'bg-koombo-grafite hover:bg-koombo-grafite/90 text-koombo-branco border-koombo-grafite'
              : 'hover:bg-koombo-grafite/10 border-koombo-grafite text-koombo-grafite hover:text-koombo-grafite'
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
