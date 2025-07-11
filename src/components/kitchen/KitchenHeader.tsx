
import { Button } from '@/components/ui/button';
import { ChefHat, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import RestaurantSelector from '@/components/RestaurantSelector';

const KitchenHeader = () => {
  const { signOut } = useAuth();
  const { isAdmin, isSuperAdmin } = useUserRole();
  const navigate = useNavigate();

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

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {(isAdmin || isSuperAdmin) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToAdmin}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              )}
              <div className="bg-orange-100 p-2 rounded-full">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Cozinha</h1>
            </div>
            <RestaurantSelector />
          </div>
          
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
    </header>
  );
};

export default KitchenHeader;
