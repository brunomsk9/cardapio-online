
export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  featured?: boolean;
  created_at: string;
  updated_at: string;
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

// Frontend-specific types for forms and display
export interface MenuItemDisplay {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  available: boolean;
}

export interface CartItemDisplay extends MenuItemDisplay {
  quantity: number;
}
