
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Clock, Phone, MapPin, User, DollarSign, CheckCircle, Utensils, Play, Ban, MessageSquare } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';

type Order = Database['public']['Tables']['orders']['Row'];

const OrdersManagement = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [selectedRestaurant]);

  const fetchOrders = async () => {
    if (!selectedRestaurant) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status atualizado!",
        description: `Pedido marcado como: ${getStatusLabel(newStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendOrderToCustomer = (order: Order) => {
    const restaurantName = selectedRestaurant?.name || 'Sabor & Arte';
    const cleanPhone = order.customer_phone.replace(/\D/g, '');
    
    // Buscar configurações do restaurante para usar mensagem personalizada
    // Por enquanto, usar a mensagem padrão
    let message = `🍽️ *NOVO PEDIDO - ${restaurantName}*\n\n`;
    message += `📋 *Pedido:* ${order.id}\n`;
    message += `👤 *Cliente:* ${order.customer_name}\n`;
    message += `📱 *Telefone:* ${order.customer_phone}\n`;
    message += `📧 *Email:* ${order.customer_email}\n`;
    message += `📍 *Endereço:* ${order.delivery_address}\n\n`;
    
    message += `🛒 *Itens do Pedido:*\n`;
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any, index: number) => {
        message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      });
    }
    
    message += `\n💰 *Total: R$ ${order.total.toFixed(2)}*\n\n`;
    message += `💳 *Forma de Pagamento:* ${getPaymentMethodLabel(order.payment_method)}\n\n`;
    
    if (order.notes) {
      message += `📝 *Observações:* ${order.notes}\n\n`;
    }
    
    message += `Obrigado pela preferência! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto!",
      description: `Mensagem preparada para ${order.customer_name}`,
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      pix: 'PIX',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      cash: 'Dinheiro',
      whatsapp: 'WhatsApp'
    };
    return labels[method as keyof typeof labels] || method;
  };

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

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

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

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (!selectedRestaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Selecione um restaurante para visualizar os pedidos.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Gerenciar Pedidos</h3>
          <p className="text-sm text-gray-600 mt-1">Restaurante: {selectedRestaurant.name}</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden border-l-4 border-l-orange-500">
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
                <div>
                  <h4 className="font-medium mb-2">Alterar Status:</h4>
                  <div className="flex flex-wrap gap-2">
                    {statusButtons.map(({ status, label, icon: Icon }) => (
                      <Button
                        key={status}
                        size="sm"
                        className={getStatusButtonColor(status, order.status)}
                        onClick={() => updateOrderStatus(order.id, status)}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => sendOrderToCustomer(order)}
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
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum pedido encontrado para este restaurante.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
