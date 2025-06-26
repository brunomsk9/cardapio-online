
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Phone, User, Building2, ShoppingCart, Utensils, BarChart3, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WhatsAppCTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    restaurantName: '',
    phone: ''
  });

  const generateWhatsAppMessage = () => {
    if (!formData.name || !formData.restaurantName) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e o nome do restaurante.",
        variant: "destructive",
      });
      return;
    }

    const message = `🍽️ *Olá, equipe KOOMBO!*

👤 *Nome:* ${formData.name}
🏪 *Restaurante:* ${formData.restaurantName}
${formData.phone ? `📱 *Telefone:* ${formData.phone}` : ''}

Tenho interesse em conhecer melhor o sistema KOOMBO para gestão de pedidos e delivery do meu restaurante.

Gostaria de saber mais sobre:
✅ Como funciona o sistema
✅ Preços e planos disponíveis  
✅ Demonstração do produto
✅ Processo de implementação

*CONTROLE TUDO, DO SALÃO À COZINHA, COM UM CLIQUE!* 🚀

Aguardo retorno. Obrigado!`;

    // Número do WhatsApp da Koombo (você deve substituir pelo número real)
    const whatsappNumber = '5511999999999'; // Substitua pelo número real
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto!",
      description: "Mensagem personalizada gerada com sucesso!",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="bg-gradient-to-br from-orange-500 to-red-600 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Lado esquerdo - Texto promocional */}
            <div>
              <h2 className="text-4xl font-bold mb-6">
                PERFEITO PARA SUA OPERAÇÃO.
              </h2>
              <div className="space-y-4 text-lg">
                <p className="flex items-center gap-3">
                  <Utensils className="h-6 w-6 text-white" />
                  Gestão completa de pedidos
                </p>
                <p className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-white" />
                  Relatórios e controle total
                </p>
                <p className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-white" />
                  Implementação rápida e fácil
                </p>
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur">
                <p className="text-xl font-semibold">
                  CONTROLE TUDO, DO SALÃO À COZINHA, COM UM CLIQUE.
                </p>
              </div>
            </div>

            {/* Lado direito - Formulário WhatsApp */}
            <div className="bg-white/95 backdrop-blur p-8 rounded-2xl text-gray-800 shadow-2xl">
              <div className="text-center mb-6">
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Fale Conosco no WhatsApp
                </h3>
                <p className="text-gray-600 mt-2">
                  Receba uma demonstração personalizada
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Seu Nome *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite seu nome"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="restaurant" className="text-gray-700 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Nome do Restaurante *
                  </Label>
                  <Input
                    id="restaurant"
                    value={formData.restaurantName}
                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                    placeholder="Nome do seu restaurante"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone (opcional)
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={generateWhatsAppMessage}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold flex items-center justify-center gap-3"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar no WhatsApp
                </Button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  * Campos obrigatórios para gerar a mensagem personalizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
