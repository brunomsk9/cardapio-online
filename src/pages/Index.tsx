
import { useState } from 'react';
import { MenuItem } from '@/types';
import { mockMenuItems } from '@/data/mockData';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import Cart from '@/components/Cart';
import CategoryFilter from '@/components/CategoryFilter';
import AdminPanel from '@/components/AdminPanel';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const {
    cart,
    addToCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems
  } = useCart();

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'entrada', label: 'Entradas' },
    { key: 'principal', label: 'Pratos Principais' },
    { key: 'bebida', label: 'Bebidas' },
    { key: 'sobremesa', label: 'Sobremesas' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast({
      title: "Item adicionado!",
      description: `${item.name} foi adicionado ao carrinho.`,
    });
  };

  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    toast({
      title: "Item atualizado!",
      description: "O item foi atualizado com sucesso.",
    });
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item removido!",
      description: "O item foi removido do cardápio.",
    });
  };

  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString()
    };
    setMenuItems(prev => [...prev, item]);
    toast({
      title: "Item adicionado!",
      description: "Novo item foi adicionado ao cardápio.",
    });
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          cartItemsCount={0}
          onCartClick={() => {}}
          onAdminClick={() => setIsAdminMode(false)}
          isAdmin={true}
        />
        <AdminPanel
          menuItems={menuItems}
          onUpdateMenuItem={handleUpdateMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onAddMenuItem={handleAddMenuItem}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
        onAdminClick={() => setIsAdminMode(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Nosso Cardápio
          </h2>
          <p className="text-gray-600 text-lg">
            Descubra sabores únicos preparados com ingredientes frescos e muito amor
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              cartQuantity={getCartQuantity(item.id)}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum item encontrado nesta categoria.
            </p>
          </div>
        )}
      </main>

      {showCart && (
        <Cart
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onClose={() => setShowCart(false)}
          totalPrice={getTotalPrice()}
        />
      )}
    </div>
  );
};

export default Index;
