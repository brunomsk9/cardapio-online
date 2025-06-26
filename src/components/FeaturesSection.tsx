
import { ShoppingCart, Utensils, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: '#4B5563' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center" style={{ color: 'white' }}>
            TUDO O QUE VOCÊ PRECISA EM UM <span style={{ color: '#FF521D' }}>KOOMBO</span> SÓ.
          </h1>
          
          <h2 className="text-2xl font-light mb-16 text-center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Tenha sua gestão de pedidos tudo sob controle.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-koombo-laranja text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Gestão de Pedidos</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Controle total sobre todos os pedidos, desde o recebimento até a entrega.
                Acompanhe o status em tempo real e mantenha seus clientes sempre informados.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-koombo-laranja text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Cozinha Integrada</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Sistema integrado para a cozinha acompanhar e gerenciar os pedidos em tempo real.
                Otimize o fluxo de trabalho e reduza o tempo de preparo.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-koombo-laranja text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Relatórios Completos</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Acompanhe vendas, clientes e performance com relatórios detalhados.
                Tome decisões baseadas em dados e faça seu negócio crescer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
