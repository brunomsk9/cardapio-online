
import * as z from 'zod';

export const restaurantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().default(''),
  address: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().email('Email inválido').or(z.literal('')).default(''),
  logo_url: z.string().url('URL inválida').or(z.literal('')).default(''),
  subdomain: z.string().default('')
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;
