
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Building2, ArrowRight } from 'lucide-react';
import { useSubdomainAccess } from '@/hooks/useSubdomainAccess';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface SubdomainAccessGuardProps {
  children: React.ReactNode;
}

const SubdomainAccessGuard = ({ children }: SubdomainAccessGuardProps) => {
  const { hasAccess, loading, error, shouldRedirect, redirectUrl } = useSubdomainAccess();
  const { user, signOut } = useAuth();

  // Efeito para redirecionar automaticamente após um delay
  useEffect(() => {
    if (shouldRedirect && redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000); // Redireciona após 3 segundos

      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, redirectUrl]);

  // Mostra loading enquanto verifica permissões
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permissões de acesso...</p>
        </div>
      </div>
    );
  }

  // Se tem acesso, renderiza o conteúdo normalmente
  if (hasAccess) {
    return <>{children}</>;
  }

  // Se não tem acesso, mostra tela de bloqueio
  const handleSignOut = async () => {
    await signOut();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleRedirectNow = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600">
              {error || 'Você não tem permissão para acessar este domínio.'}
            </p>
          </div>

          {user && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                Logado como: <strong>{user.email}</strong>
              </p>
            </div>
          )}

          <div className="space-y-3">
            {shouldRedirect && redirectUrl && (
              <>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-blue-800">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">
                      Redirecionando para seu restaurante...
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={handleRedirectNow}
                  className="w-full"
                  variant="default"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Ir para meu restaurante agora
                </Button>
              </>
            )}
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Fazer logout e tentar novamente
            </Button>
            
            {!shouldRedirect && (
              <Button
                onClick={() => window.location.href = window.location.origin}
                variant="ghost"
                className="w-full"
              >
                Voltar ao início
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubdomainAccessGuard;
