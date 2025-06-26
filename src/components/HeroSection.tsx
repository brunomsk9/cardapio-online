
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-orange-500 to-red-600 py-20 text-white overflow-hidden">
      <div className="relative container mx-auto text-center px-4 z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 max-w-4xl mx-auto border border-white/20">
          <h1 className="text-6xl font-bold mb-6 text-white">
            KOOMBO
          </h1>
          <p className="text-2xl font-light mb-8 text-white/90">
            PEDIDOS & GESTÃO
          </p>
          <div className="bg-white/20 backdrop-blur rounded-xl p-8 mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              PERFEITO PARA SUA OPERAÇÃO.
            </h2>
            <p className="text-xl text-white/90">
              O sistema completo para gerenciar seu restaurante com eficiência total.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
