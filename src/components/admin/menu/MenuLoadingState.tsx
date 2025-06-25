
const MenuLoadingState = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Cardápio</h3>
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="ml-4 text-gray-600">Carregando cardápio...</p>
      </div>
    </div>
  );
};

export default MenuLoadingState;
