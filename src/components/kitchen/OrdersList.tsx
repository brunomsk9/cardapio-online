
import OrderCard from './OrderCard';
import EmptyOrdersState from './EmptyOrdersState';
import { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrdersListProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

const OrdersList = ({ orders, onStatusUpdate }: OrdersListProps) => {
  if (orders.length === 0) {
    return <EmptyOrdersState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};

export default OrdersList;
