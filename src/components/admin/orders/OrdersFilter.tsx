
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrdersFilterProps {
  statusFilter: string;
  onFilterChange: (filter: string) => void;
}

const OrdersFilter = ({ statusFilter, onFilterChange }: OrdersFilterProps) => {
  return (
    <Select value={statusFilter} onValueChange={onFilterChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filtrar por status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os pedidos</SelectItem>
        <SelectItem value="pending">Pendentes</SelectItem>
        <SelectItem value="confirmed">Confirmados</SelectItem>
        <SelectItem value="preparing">Preparando</SelectItem>
        <SelectItem value="ready">Prontos</SelectItem>
        <SelectItem value="delivered">Entregues</SelectItem>
        <SelectItem value="cancelled">Cancelados</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OrdersFilter;
