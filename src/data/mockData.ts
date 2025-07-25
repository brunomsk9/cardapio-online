
import { MenuItem } from '@/types';

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    restaurant_id: 'mock-restaurant-1',
    name: 'Bruschetta Italiana',
    description: 'Pão tostado com tomate, manjericão fresco e azeite extra virgem',
    price: 18.90,
    category: 'entrada',
    image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    restaurant_id: 'mock-restaurant-1',
    name: 'Salmão Grelhado',
    description: 'Salmão fresco grelhado com legumes salteados e molho de ervas',
    price: 45.90,
    category: 'principal',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    restaurant_id: 'mock-restaurant-1',
    name: 'Risotto de Camarão',
    description: 'Risotto cremoso com camarões frescos e toque de limão siciliano',
    price: 42.50,
    category: 'principal',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03246963d321?w=400',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    restaurant_id: 'mock-restaurant-1',
    name: 'Vinho Tinto Premium',
    description: 'Vinho tinto selecionado da casa, taça 200ml',
    price: 22.00,
    category: 'bebida',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    restaurant_id: 'mock-restaurant-1',
    name: 'Tiramisu',
    description: 'Sobremesa italiana tradicional com café e mascarpone',
    price: 16.90,
    category: 'sobremesa',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    restaurant_id: 'mock-restaurant-1',
    name: 'Carpaccio de Carne',
    description: 'Fatias finas de carne bovina com rúcula e parmesão',
    price: 28.90,
    category: 'entrada',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
