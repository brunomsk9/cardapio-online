
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';

interface Customer {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
}

const CustomersManagement = () => {
  const { selectedRestaurant } = useUserRestaurant();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    if (!selectedRestaurant) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Filtrar pedidos apenas do restaurante selecionado
      const { data, error } = await supabase
        .from('orders')
        .select('customer_name, customer_email, customer_phone, total, created_at')
        .or(`restaurant_id.eq.${selectedRestaurant.id},restaurant_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Agrupar clientes e calcular estatísticas
      const customerMap = new Map<string, Customer>();
      
      data?.forEach(order => {
        const key = `${order.customer_email}-${order.customer_phone}`;
        
        if (customerMap.has(key)) {
          const existing = customerMap.get(key)!;
          existing.total_orders += 1;
          existing.total_spent += Number(order.total);
          if (new Date(order.created_at) > new Date(existing.last_order_date)) {
            existing.last_order_date = order.created_at;
          }
        } else {
          customerMap.set(key, {
            id: key,
            customer_name: order.customer_name,
            customer_email: order.customer_email || '',
            customer_phone: order.customer_phone,
            total_orders: 1,
            total_spent: Number(order.total),
            last_order_date: order.created_at
          });
        }
      });

      const customersArray = Array.from(customerMap.values())
        .sort((a, b) => b.total_spent - a.total_spent);

      setCustomers(customersArray);
      setFilteredCustomers(customersArray);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [selectedRestaurant]);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestão de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">
              {filteredCustomers.length} clientes
            </Badge>
          </div>

          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{customer.customer_name}</h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {customer.customer_email || 'Email não informado'}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {customer.customer_phone}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Último pedido: {formatDate(customer.last_order_date)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{customer.total_orders} pedidos</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        R$ {customer.total_spent.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCustomers.length === 0 && customers.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum cliente encontrado com os critérios de busca.</p>
            </div>
          )}

          {customers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum cliente encontrado.</p>
              <p className="text-sm text-gray-400 mt-2">
                Os clientes aparecerão aqui após realizarem pedidos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersManagement;
