
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Phone, MapPin, User, DollarSign, MessageSquare, Printer } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import OrderStatusButtons from './OrderStatusButtons';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
  onSendToCustomer: (order: Order) => void;
}

const OrderCard = ({ order, onStatusUpdate, onSendToCustomer }: OrderCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
      preparing: { label: 'Preparando', color: 'bg-orange-100 text-orange-800' },
      ready: { label: 'Pronto', color: 'bg-green-100 text-green-800' },
      delivered: { label: 'Entregue', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const statusConfig: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pedido #${order.id.slice(0, 8)}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #f97316;
              border-bottom: 2px solid #f97316;
              padding-bottom: 10px;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 4px;
              font-weight: bold;
              margin: 10px 0;
            }
            .section {
              margin: 20px 0;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .info-row {
              margin: 8px 0;
              display: flex;
              gap: 8px;
            }
            .info-label {
              font-weight: bold;
              min-width: 120px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            .items-table th, .items-table td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            .items-table th {
              background-color: #f3f4f6;
              font-weight: bold;
            }
            .total-row {
              font-weight: bold;
              font-size: 18px;
              text-align: right;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #000;
            }
            .notes {
              background-color: #fef3c7;
              padding: 10px;
              border-radius: 4px;
              margin: 10px 0;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>Pedido #${order.id.slice(0, 8)}</h1>
          
          <div class="section">
            <div class="info-row">
              <span class="info-label">Data/Hora:</span>
              <span>${new Date(order.created_at).toLocaleString('pt-BR')}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status">${statusConfig[order.status] || order.status}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Informações do Cliente</div>
            <div class="info-row">
              <span class="info-label">Nome:</span>
              <span>${order.customer_name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Telefone:</span>
              <span>${order.customer_phone}</span>
            </div>
            ${order.customer_email ? `
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span>${order.customer_email}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Endereço:</span>
              <span>${order.delivery_address}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Itens do Pedido</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center">Qtd.</th>
                  <th style="text-align: right">Preço Unit.</th>
                  <th style="text-align: right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${Array.isArray(order.items) ? order.items.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td style="text-align: center">${item.quantity}</td>
                    <td style="text-align: right">R$ ${item.price.toFixed(2)}</td>
                    <td style="text-align: right">R$ ${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('') : ''}
              </tbody>
            </table>
            <div class="total-row">
              Total: R$ ${order.total.toFixed(2)}
            </div>
            <div class="info-row" style="margin-top: 10px;">
              <span class="info-label">Forma de Pagamento:</span>
              <span>${order.payment_method.toUpperCase()}</span>
            </div>
          </div>

          ${order.notes ? `
          <div class="section">
            <div class="section-title">Observações</div>
            <div class="notes">${order.notes}</div>
          </div>
          ` : ''}

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            Pedido #{order.id.slice(0, 8)}
          </CardTitle>
          {getStatusBadge(order.status)}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {new Date(order.created_at).toLocaleString('pt-BR')}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-1" />
              <span className="text-sm">{order.delivery_address}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-bold text-green-600">R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Pagamento: {order.payment_method.toUpperCase()}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Itens do Pedido:</h4>
          <div className="space-y-1">
            {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="text-right font-bold text-lg pt-2 border-t">
              Total: R$ {order.total.toFixed(2)}
            </div>
          </div>
        </div>

        {order.notes && (
          <div>
            <h4 className="font-medium mb-1">Observações:</h4>
            <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">{order.notes}</p>
          </div>
        )}

        <div className="space-y-3">
          <OrderStatusButtons
            currentStatus={order.status}
            onStatusChange={(status) => onStatusUpdate(order.id, status)}
          />
          
          <div className="flex justify-end gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="bg-gray-50 border-gray-200 hover:bg-gray-100"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button
              onClick={() => onSendToCustomer(order)}
              variant="outline"
              size="sm"
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar ao Cliente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
