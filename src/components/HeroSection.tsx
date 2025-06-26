
interface HeroSectionProps {
  title: string;
  description: string;
}

const HeroSection = ({ title, description }: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-br from-koombo-orange to-orange-600 py-20">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-5xl md:text-6xl font-bold font-sans text-koombo-white mb-6 tracking-tight">
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-koombo-white/90 max-w-3xl mx-auto font-light leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
