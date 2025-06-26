
interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Carregando..." }: LoadingStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-koombo-graphite">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-koombo-orange mx-auto"></div>
        <p className="mt-4 text-koombo-white">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
