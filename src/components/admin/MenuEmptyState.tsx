
import React from 'react';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed } from 'lucide-react';

interface MenuEmptyStateProps {
  onCreateFirst: () => void;
}

const MenuEmptyState = ({ onCreateFirst }: MenuEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum item no cardápio
      </h3>
      <p className="text-gray-500 mb-4">
        Comece criando seu primeiro item do cardápio.
      </p>
      <Button onClick={onCreateFirst}>
        Criar Primeiro Item
      </Button>
    </div>
  );
};

export default MenuEmptyState;
