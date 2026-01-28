
import { Database } from '@/integrations/supabase/types';
import { getRestaurantTheme } from '@/hooks/useRestaurantTheme';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantHeroProps {
  restaurant: Restaurant | null;
  pageTitle: string;
  pageDescription: string;
}

const RestaurantHero = ({ restaurant, pageTitle, pageDescription }: RestaurantHeroProps) => {
  const theme = getRestaurantTheme(restaurant);
  
  // Use custom hero image if available, otherwise fallback to logo or default
  const heroImage = theme.heroImageUrl || restaurant?.logo_url || '/lovable-uploads/0c88a4e4-020c-4637-bce1-b2b693821e08.png';

  return (
    <section 
      className="relative min-h-[500px] flex items-center overflow-hidden"
      style={{ backgroundColor: theme.secondaryColor }}
    >
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado esquerdo - Texto */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              BEM-VINDO AO <br />
              <span style={{ color: theme.primaryColor }}>{pageTitle.toUpperCase()}</span>
            </h1>
            
            <p className="text-lg lg:text-xl font-light text-white/90 max-w-md">
              {pageDescription}
            </p>
            
            <div className="pt-4">
              <button 
                onClick={() => document.querySelector('#cardapio')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:opacity-90"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Ver Cardápio
              </button>
            </div>
          </div>

          {/* Lado direito - Imagem do restaurante ou placeholder */}
          <div className="relative">
            <div 
              className="w-full h-[350px] lg:h-[400px] bg-cover bg-center rounded-2xl shadow-2xl"
              style={{ backgroundImage: `url('${heroImage}')` }}
            >
              {/* Overlay sutil para melhor contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div 
        className="absolute top-10 left-10 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: theme.primaryColor }}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-24 h-24 rounded-full opacity-5"
        style={{ backgroundColor: theme.primaryColor }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full opacity-10"
        style={{ backgroundColor: theme.primaryColor }}
      ></div>
    </section>
  );
};

export default RestaurantHero;
