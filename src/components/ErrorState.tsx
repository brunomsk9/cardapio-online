
interface ErrorStateProps {
  title: string;
  message: string;
  subtitle?: string;
}

const ErrorState = ({ title, message, subtitle }: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-koombo-graphite">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-koombo-white mb-4">{title}</h2>
        <p className="text-koombo-white mb-4">{message}</p>
        {subtitle && (
          <p className="text-sm text-koombo-white/70">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
