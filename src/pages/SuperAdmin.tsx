
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Users, Settings, ArrowRight, LogOut } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import RestaurantsManagement from '@/components/admin/RestaurantsManagement';
import UsersManagement from '@/components/admin/UsersManagement';

const SuperAdmin = () => {
  const { isSuperAdmin, loading } = useUserRole();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('restaurants');

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

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
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>Acessar Admin</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Super Administrador
              </Badge>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
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

        {activeTab === 'restaurants' && <RestaurantsManagement />}
        {activeTab === 'users' && <UsersManagement />}
      </div>
    </div>
  );
};

export default SuperAdmin;
