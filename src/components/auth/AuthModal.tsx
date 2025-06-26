
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isResetPassword) {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        
        if (error) throw error;
        
        toast({
          title: "Email de recuperação enviado!",
          description: "Verifique sua caixa de entrada e spam para redefinir sua senha.",
        });
        
        setIsResetPassword(false);
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email ou senha incorretos. Verifique suas credenciais.');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Email não confirmado. Verifique sua caixa de entrada.');
          }
          throw error;
        }
        
        if (data.user) {
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo, ${data.user.email}!`,
          });
          onSuccess();
        }
      } else {
        // Validações básicas
        if (!fullName.trim()) {
          throw new Error('Nome completo é obrigatório.');
        }
        if (!phone.trim()) {
          throw new Error('Telefone é obrigatório.');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }

        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
            }
          }
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('Este email já está registrado. Tente fazer login ou recuperar a senha.');
          }
          throw error;
        }
        
        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Cadastro realizado!",
            description: "Verifique seu email para confirmar a conta e fazer login.",
          });
        } else if (data.user) {
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Você já pode usar a aplicação.",
          });
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setShowPassword(false);
    setIsResetPassword(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const switchToResetPassword = () => {
    setIsResetPassword(true);
    setPassword('');
    setShowPassword(false);
  };

  const switchBackToLogin = () => {
    setIsResetPassword(false);
    setEmail('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-koombo-white border-koombo-graphite shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-center text-2xl font-bold text-koombo-graphite">
            {isResetPassword 
              ? 'Recuperar Senha' 
              : isLogin 
                ? 'Fazer Login' 
                : 'Criar Conta'
            }
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && !isResetPassword && (
            <>
              <div className="space-y-3">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-koombo-graphite font-medium">
                  <User className="h-4 w-4 text-koombo-orange" />
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="h-12 border-koombo-graphite rounded-xl focus:border-koombo-orange focus:ring-koombo-orange bg-koombo-white text-koombo-graphite"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="flex items-center gap-2 text-koombo-graphite font-medium">
                  <Phone className="h-4 w-4 text-koombo-orange" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="h-12 border-koombo-graphite rounded-xl focus:border-koombo-orange focus:ring-koombo-orange bg-koombo-white text-koombo-graphite"
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-3">
            <Label htmlFor="email" className="flex items-center gap-2 text-koombo-graphite font-medium">
              <Mail className="h-4 w-4 text-koombo-orange" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="h-12 border-koombo-graphite rounded-xl focus:border-koombo-orange focus:ring-koombo-orange bg-koombo-white text-koombo-graphite"
              required
            />
          </div>
          
          {!isResetPassword && (
            <div className="space-y-3">
              <Label htmlFor="password" className="flex items-center gap-2 text-koombo-graphite font-medium">
                <Lock className="h-4 w-4 text-koombo-orange" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="h-12 border-koombo-graphite rounded-xl focus:border-koombo-orange focus:ring-koombo-orange bg-koombo-white text-koombo-graphite pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-koombo-graphite/50 hover:text-koombo-orange"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-koombo-orange hover:bg-koombo-orange/90 text-koombo-white font-semibold rounded-xl border-0 shadow-md transition-all duration-200" 
            disabled={loading}
          >
            {loading ? 'Carregando...' : (
              isResetPassword 
                ? 'Enviar Email de Recuperação'
                : isLogin 
                  ? 'Entrar' 
                  : 'Criar Conta'
            )}
          </Button>
          
          <div className="space-y-3 pt-4 border-t border-koombo-graphite/20">
            {isResetPassword ? (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-koombo-graphite hover:bg-koombo-white/50 rounded-xl"
                onClick={switchBackToLogin}
              >
                Voltar ao Login
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-koombo-graphite hover:bg-koombo-white/50 rounded-xl font-medium"
                  onClick={switchMode}
                >
                  {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                </Button>
                
                {isLogin && (
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm text-koombo-orange hover:text-koombo-orange/80"
                    onClick={switchToResetPassword}
                  >
                    Esqueceu a senha?
                  </Button>
                )}
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
