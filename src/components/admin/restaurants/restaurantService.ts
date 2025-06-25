
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export interface RestaurantFormData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  subdomain: string;
}

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createRestaurant = async (data: RestaurantFormData): Promise<void> => {
  const { error } = await supabase
    .from('restaurants')
    .insert({
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      logo_url: data.logo_url || null,
      subdomain: data.subdomain
    });

  if (error) {
    if (error.code === '23505' && error.message.includes('subdomain')) {
      throw new Error('Este subdomínio já está sendo usado por outro restaurante. Escolha um diferente.');
    }
    throw error;
  }
};

export const updateRestaurant = async (id: string, data: RestaurantFormData): Promise<void> => {
  const { error } = await supabase
    .from('restaurants')
    .update({
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      logo_url: data.logo_url || null,
      subdomain: data.subdomain,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    if (error.code === '23505' && error.message.includes('subdomain')) {
      throw new Error('Este subdomínio já está sendo usado por outro restaurante. Escolha um diferente.');
    }
    throw error;
  }
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const toggleRestaurantStatus = async (id: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('restaurants')
    .update({ 
      is_active: !isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
};
