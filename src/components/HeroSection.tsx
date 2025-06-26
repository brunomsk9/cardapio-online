
const HeroSection = () => {
  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden">
      <div className="relative container mx-auto text-center px-4 z-10">
        <div className="bg-white shadow-lg rounded-2xl p-12 max-w-4xl mx-auto border border-gray-200">
          <h1 className="text-6xl font-bold mb-6 text-koombo-grafite">
            KOOMBO
          </h1>
          <p className="text-2xl font-light mb-8 text-koombo-grafite/70">
            PEDIDOS & GESTÃO
          </p>
          <div className="bg-koombo-laranja rounded-xl p-8 mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              PERFEITO PARA SUA OPERAÇÃO.
            </h2>
            <p className="text-xl text-white/90">
              O sistema completo para gerenciar seu restaurante com eficiência total.
            </p>
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
