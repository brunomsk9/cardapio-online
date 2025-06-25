
import { Database } from '@/integrations/supabase/types';
import OrderCard from './OrderCard';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrdersListProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, newStatus: string) => void;
  onSendToCustomer: (order: Order) => void;
}

const OrdersList = ({ orders, onStatusUpdate, onSendToCustomer }: OrdersListProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum pedido encontrado para este restaurante.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
          onSendToCustomer={onSendToCustomer}
        />
      ))}
    </div>
  );
};

export default OrdersList;
