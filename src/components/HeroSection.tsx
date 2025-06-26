
const HeroSection = () => {
  return (
    <section className="relative bg-koombo-grafite min-h-[600px] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado esquerdo - Texto */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              TUDO O QUE VOCÊ <br />
              PRECISA EM UM <br />
              <span className="text-koombo-laranja">KOOMBO</span> SÓ.
            </h1>
            
            <p className="text-xl lg:text-2xl font-light text-white/90 max-w-md">
              Tenha sua gestão de pedidos tudo sob controle.
            </p>
          </div>

          {/* Lado direito - Imagem */}
          <div className="relative">
            <div 
              className="w-full h-[400px] lg:h-[500px] bg-cover bg-center rounded-2xl shadow-2xl"
              style={{
                backgroundImage: `url('/lovable-uploads/fde4e1ad-34f3-424b-834a-cfaccde5473d.png')`
              }}
            >
              {/* Overlay para melhor contraste se necessário */}
              <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
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
