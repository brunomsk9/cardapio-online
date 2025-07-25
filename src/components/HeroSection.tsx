
const HeroSection = () => {
  return (
    <section className="relative bg-koombo-grafite min-h-[600px] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado esquerdo - Texto */}
          <div className="text-koombo-branco space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              TUDO O QUE VOCÊ <br />
              PRECISA EM UM <br />
              <span className="text-koombo-laranja">KOOMBO</span> SÓ.
            </h1>
            
            <p className="text-xl lg:text-2xl font-light text-koombo-branco/90 max-w-md">
              Tenha sua gestão de pedidos tudo sob controle.
            </p>
            
            <div className="pt-4">
              <button className="bg-koombo-laranja hover:bg-koombo-laranja/90 text-koombo-branco font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg">
                Começar Agora
              </button>
            </div>
          </div>

          {/* Lado direito - Imagem */}
          <div className="relative">
            <div 
              className="w-full h-[400px] lg:h-[500px] bg-cover bg-center rounded-2xl shadow-2xl"
              style={{
                backgroundImage: `url('/lovable-uploads/0c88a4e4-020c-4637-bce1-b2b693821e08.png')`
              }}
            >
              {/* Overlay sutil para melhor contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-koombo-laranja/10 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-koombo-laranja/5 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-koombo-laranja/10 rounded-full"></div>
    </section>
  );
};

export default HeroSection;
