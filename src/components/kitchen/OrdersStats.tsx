
interface OrdersStatsProps {
  ordersCount: number;
}

const OrdersStats = ({ ordersCount }: OrdersStatsProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">Pedidos Ativos</h2>
      <p className="text-gray-600">
        {ordersCount} pedido{ordersCount !== 1 ? 's' : ''} em preparo ou aguardando
      </p>
    </div>
  );
};

export default OrdersStats;
