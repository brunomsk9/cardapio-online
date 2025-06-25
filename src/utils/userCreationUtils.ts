
import { supabase } from '@/integrations/supabase/client';

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export const createUser = async (userData: CreateUserData) => {
  console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
  
  // 1. Criar usuário via signUp (deixa o trigger criar o papel padrão)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        full_name: userData.fullName,
        phone: userData.phone
      },
      emailRedirectTo: `${window.location.origin}/`
    }
  });

  if (authError) {
    console.error('Auth error:', authError);
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Falha ao criar usuário');
  }

  console.log('User created successfully:', authData.user.id);

  // 2. Aguardar um pouco para os triggers serem executados
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Atualizar perfil
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: authData.user.id,
      full_name: userData.fullName,
      phone: userData.phone
    }, {
      onConflict: 'id'
    });

  if (profileError) {
    console.error('Error updating profile:', profileError);
    throw new Error('Usuário criado, mas não foi possível atualizar o perfil');
  } else {
    console.log('Profile updated successfully');
  }

  return authData.user;
};

export const createUserWithRestaurant = async (
  userData: CreateUserData, 
  restaurantId: string
) => {
  const user = await createUser(userData);

  // 4. Associar ao restaurante se fornecido
  console.log('Associating user to restaurant:', restaurantId);
  
  const { error: restaurantError } = await supabase
    .from('user_restaurants')
    .upsert({
      user_id: user.id,
      restaurant_id: restaurantId
    }, {
      onConflict: 'user_id,restaurant_id'
    });

  if (restaurantError) {
    console.error('Error associating user to restaurant:', restaurantError);
    throw new Error('Usuário criado, mas não foi possível associá-lo ao restaurante.');
  } else {
    console.log('User associated to restaurant successfully');
  }

  return user;
};

// Manter compatibilidade com código existente
export const createUserWithRole = createUser;
