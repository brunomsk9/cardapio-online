
import { ShoppingCart, Utensils, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-koombo-grafite">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            TUDO O QUE VOCÊ PRECISA EM UM <span className="text-koombo-laranja">KOOMBO</span> SÓ.
          </h1>
          
          <p className="text-xl md:text-2xl font-light mb-16 text-white/90">
            Tenha sua gestão de pedidos tudo sob controle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-koombo-laranja text-white rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <ShoppingCart className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Gestão de Pedidos</h3>
              <p className="text-white/80 leading-relaxed">
                Controle total sobre todos os pedidos, desde o recebimento até a entrega.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-koombo-laranja text-white rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <Utensils className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Cozinha Integrada</h3>
              <p className="text-white/80 leading-relaxed">
                Sistema integrado para a cozinha acompanhar pedidos em tempo real.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-koombo-laranja text-white rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Relatórios Completos</h3>
              <p className="text-white/80 leading-relaxed">
                Acompanhe vendas e performance com relatórios detalhados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
