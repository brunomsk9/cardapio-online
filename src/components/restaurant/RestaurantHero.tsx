
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantHeroProps {
  restaurant: Restaurant | null;
  pageTitle: string;
  pageDescription: string;
}

const RestaurantHero = ({ restaurant, pageTitle, pageDescription }: RestaurantHeroProps) => {
  return (
    <section className="relative bg-koombo-grafite min-h-[500px] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado esquerdo - Texto */}
          <div className="text-koombo-branco space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              BEM-VINDO AO <br />
              <span className="text-koombo-laranja">{pageTitle.toUpperCase()}</span>
            </h1>
            
            <p className="text-lg lg:text-xl font-light text-koombo-branco/90 max-w-md">
              {pageDescription}
            </p>
            
            <div className="pt-4">
              <button 
                onClick={() => document.querySelector('#cardapio')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-koombo-laranja hover:bg-koombo-laranja/90 text-koombo-branco font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
              >
                Ver Cardápio
              </button>
            </div>
          </div>

          {/* Lado direito - Imagem do restaurante ou placeholder */}
          <div className="relative">
            <div 
              className="w-full h-[350px] lg:h-[400px] bg-cover bg-center rounded-2xl shadow-2xl"
              style={{
                backgroundImage: restaurant?.logo_url 
                  ? `url('${restaurant.logo_url}')`
                  : `url('/lovable-uploads/0c88a4e4-020c-4637-bce1-b2b693821e08.png')`
              }}
            >
              {/* Overlay sutil para melhor contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-koombo-laranja/10 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-koombo-laranja/5 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-koombo-laranja/10 rounded-full"></div>
    </section>
  );
};

export default RestaurantHero;
