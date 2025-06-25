
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Users, Settings } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from '@/hooks/use-toast';

const SuperAdmin = () => {
  const { isSuperAdmin, loading } = useUserRole();
  const [activeTab, setActiveTab] = useState('restaurants');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Apenas super administradores podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
                <p className="text-gray-600">Gerenciamento global do sistema</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Super Administrador
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          <Button
            variant={activeTab === 'restaurants' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('restaurants')}
            className="flex items-center space-x-2"
          >
            <Building2 className="h-4 w-4" />
            <span>Restaurantes</span>
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Usuários Globais</span>
          </Button>
        </div>

        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Restaurantes</h2>
              <Button className="bg-gradient-to-r from-green-500 to-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Novo Restaurante
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum restaurante encontrado
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comece criando seu primeiro restaurante no sistema.
                  </p>
                  <Button>Criar Primeiro Restaurante</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Usuários do Sistema</h2>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Carregando usuários...
                  </h3>
                  <p className="text-gray-500">
                    Funcionalidade de gestão de usuários será implementada em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
