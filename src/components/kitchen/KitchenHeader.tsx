
import { Utensils } from 'lucide-react';

const KitchenHeader = () => {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <Utensils className="h-8 w-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Cozinha - Sabor & Arte</h1>
        </div>
      </div>
    </header>
  );
};

export default KitchenHeader;
