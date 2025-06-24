
import { MenuItem } from '@/types';

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Bruschetta Italiana',
    description: 'Pão tostado com tomate, manjericão fresco e azeite extra virgem',
    price: 18.90,
    category: 'entrada',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    available: true
  },
  {
    id: '2',
    name: 'Salmão Grelhado',
    description: 'Salmão fresco grelhado com legumes salteados e molho de ervas',
    price: 45.90,
    category: 'principal',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    available: true
  },
  {
    id: '3',
    name: 'Risotto de Camarão',
    description: 'Risotto cremoso com camarões frescos e toque de limão siciliano',
    price: 42.50,
    category: 'principal',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d321?w=400',
    available: true
  },
  {
    id: '4',
    name: 'Vinho Tinto Premium',
    description: 'Vinho tinto selecionado da casa, taça 200ml',
    price: 22.00,
    category: 'bebida',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    available: true
  },
  {
    id: '5',
    name: 'Tiramisu',
    description: 'Sobremesa italiana tradicional com café e mascarpone',
    price: 16.90,
    category: 'sobremesa',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    available: true
  },
  {
    id: '6',
    name: 'Carpaccio de Carne',
    description: 'Fatias finas de carne bovina com rúcula e parmesão',
    price: 28.90,
    category: 'entrada',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    available: true
  }
];
