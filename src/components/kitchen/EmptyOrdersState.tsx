
import { Utensils } from 'lucide-react';

const EmptyOrdersState = () => {
  return (
    <div className="text-center py-12">
      <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        Nenhum pedido ativo
      </h3>
      <p className="text-gray-500">
        Todos os pedidos foram preparados ou não há novos pedidos.
      </p>
    </div>
  );
};

export default EmptyOrdersState;
