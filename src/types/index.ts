
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entrada' | 'principal' | 'bebida' | 'sobremesa';
  image: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  customerName: string;
  createdAt: Date;
}
