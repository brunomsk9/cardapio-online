
import * as z from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  image_url: z.string().url('URL inválida').optional().or(z.literal(''))
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
