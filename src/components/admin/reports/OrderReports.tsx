
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRestaurant } from '@/hooks/useUserRestaurant';
import { useUserRole } from '@/hooks/useUserRole';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { toast } from '@/hooks/use-toast';

interface OrderReport {
  date: string;
  restaurant_id: string;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  unique_customers: number;
  delivered_orders: number;
  cancelled_orders: number;
}

const OrderReports = () => {
  const [reports, setReports] = useState<OrderReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // últimos 30 dias
  const { restaurants } = useUserRestaurant();
  const { isSuperAdmin } = useUserRole();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const startDate = startOfDay(subDays(new Date(), dateRange));
      const endDate = endOfDay(new Date());

      let query = supabase
        .from('order_reports')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      // Se não for super admin, filtrar apenas restaurantes do usuário
      if (!isSuperAdmin && restaurants && restaurants.length > 0) {
        const restaurantIds = restaurants.map(r => r.id);
        query = query.in('restaurant_id', restaurantIds);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching order reports:', error);
        toast({
          title: "Erro ao carregar relatórios",
          description: "Não foi possível carregar os dados dos relatórios.",
          variant: "destructive",
        });
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Erro ao carregar relatórios",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange, restaurants, isSuperAdmin]);

  // Calcular métricas resumidas
  const totalOrders = reports.reduce((sum, report) => sum + report.total_orders, 0);
  const totalRevenue = reports.reduce((sum, report) => sum + report.total_revenue, 0);
  const totalCustomers = reports.reduce((sum, report) => sum + report.unique_customers, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Preparar dados para gráficos
  const chartData = reports.map(report => ({
    date: format(new Date(report.date), 'dd/MM', { locale: ptBR }),
    pedidos: report.total_orders,
    receita: report.total_revenue,
    clientes: report.unique_customers
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros de período */}
      <div className="flex items-center space-x-4">
        <Calendar className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-600">Período:</span>
        <div className="flex space-x-2">
          {[7, 15, 30, 60, 90].map((days) => (
            <Button
              key={days}
              variant={dateRange === days ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(days)}
            >
              {days} dias
            </Button>
          ))}
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Clientes Únicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(averageOrderValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="pedidos" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Pedidos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita Diária</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(value)),
                    'Receita'
                  ]}
                />
                <Bar dataKey="receita" fill="#3b82f6" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderReports;
