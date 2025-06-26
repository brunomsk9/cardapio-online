
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, Calendar, DollarSign, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import { useUserRole } from '@/hooks/useUserRole';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface CustomerReport {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  restaurant_id: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  first_order_date: string;
  last_order_date: string;
  completed_orders: number;
}

const CustomerReports = () => {
  const [customers, setCustomers] = useState<CustomerReport[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { restaurants } = useUserRestaurant();
  const { isSuperAdmin } = useUserRole();

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('customer_reports')
        .select('*')
        .order('total_spent', { ascending: false });

      // Se não for super admin, filtrar apenas restaurantes do usuário
      if (!isSuperAdmin && restaurants && restaurants.length > 0) {
        const restaurantIds = restaurants.map(r => r.id);
        query = query.in('restaurant_id', restaurantIds);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching customer reports:', error);
        toast({
          title: "Erro ao carregar relatórios de clientes",
          description: "Não foi possível carregar os dados dos clientes.",
          variant: "destructive",
        });
        return;
      }

      setCustomers(data || []);
      setFilteredCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customer reports:', error);
      toast({
        title: "Erro ao carregar relatórios",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar clientes baseado no termo de busca
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customer_phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  useEffect(() => {
    fetchCustomers();
  }, [restaurants, isSuperAdmin]);

  // Calcular métricas resumidas
  const totalCustomers = customers.length;
  const totalSpent = customers.reduce((sum, customer) => sum + customer.total_spent, 0);
  const averageSpentPerCustomer = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
  const topCustomer = customers[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Gasto Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalSpent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Gasto Médio/Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(averageSpentPerCustomer)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Top Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{topCustomer?.customer_name || 'N/A'}</div>
            <div className="text-xs text-gray-600">
              {topCustomer ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(topCustomer.total_spent) : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabela de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Ticket Médio</TableHead>
                  <TableHead>Primeiro Pedido</TableHead>
                  <TableHead>Último Pedido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.customer_name}</div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.customer_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {customer.customer_phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {customer.total_orders} total
                        </Badge>
                        <Badge variant="outline">
                          {customer.completed_orders} entregues
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(customer.total_spent)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(customer.average_order_value)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(customer.first_order_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(customer.last_order_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Nenhum cliente encontrado para a busca.' : 'Nenhum cliente encontrado.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerReports;
