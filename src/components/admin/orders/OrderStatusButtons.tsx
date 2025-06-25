
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Utensils, Play, Ban } from 'lucide-react';

interface OrderStatusButtonsProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const OrderStatusButtons = ({ currentStatus, onStatusChange }: OrderStatusButtonsProps) => {
  const getStatusButtonColor = (status: string, currentStatus: string) => {
    if (status === currentStatus) {
      return 'bg-orange-500 text-white hover:bg-orange-600';
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  const statusButtons = [
    { status: 'pending', label: 'Pendente', icon: Clock },
    { status: 'confirmed', label: 'Confirmado', icon: CheckCircle },
    { status: 'preparing', label: 'Preparando', icon: Utensils },
    { status: 'ready', label: 'Pronto', icon: Play },
    { status: 'delivered', label: 'Entregue', icon: CheckCircle },
    { status: 'cancelled', label: 'Cancelado', icon: Ban },
  ];

  return (
    <div>
      <h4 className="font-medium mb-2">Alterar Status:</h4>
      <div className="flex flex-wrap gap-2">
        {statusButtons.map(({ status, label, icon: Icon }) => (
          <Button
            key={status}
            size="sm"
            className={getStatusButtonColor(status, currentStatus)}
            onClick={() => onStatusChange(status)}
          >
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusButtons;
