
import { ShoppingCart, Utensils, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-koombo-grafite">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-koombo-branco">
            RECURSOS <span className="text-koombo-laranja">PRINCIPAIS</span>
          </h2>
          
          <p className="text-lg md:text-xl font-light mb-16 text-koombo-branco">
            Tudo que você precisa para gerenciar seu restaurante de forma eficiente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center p-8 bg-koombo-branco border border-koombo-laranja/20 rounded-xl hover:border-koombo-laranja/40 transition-colors">
              <div className="bg-koombo-laranja text-koombo-branco rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <ShoppingCart className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-koombo-grafite mb-4">Gestão de Pedidos</h3>
              <p className="text-koombo-grafite leading-relaxed text-center">
                Controle total sobre todos os pedidos, desde o recebimento até a entrega. 
                Sistema completo para acompanhar o status de cada pedido em tempo real.
              </p>
            </div>

            <div className="flex flex-col items-center p-8 bg-koombo-branco border border-koombo-laranja/20 rounded-xl hover:border-koombo-laranja/40 transition-colors">
              <div className="bg-koombo-laranja text-koombo-branco rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <Utensils className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-koombo-grafite mb-4">Cozinha Integrada</h3>
              <p className="text-koombo-grafite leading-relaxed text-center">
                Sistema integrado para a cozinha acompanhar pedidos em tempo real. 
                Interface otimizada para facilitar o trabalho da equipe da cozinha.
              </p>
            </div>

            <div className="flex flex-col items-center p-8 bg-koombo-branco border border-koombo-laranja/20 rounded-xl hover:border-koombo-laranja/40 transition-colors">
              <div className="bg-koombo-laranja text-koombo-branco rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-koombo-grafite mb-4">Relatórios Completos</h3>
              <p className="text-koombo-grafite leading-relaxed text-center">
                Acompanhe vendas e performance com relatórios detalhados. 
                Dados precisos para tomar melhores decisões no seu negócio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
