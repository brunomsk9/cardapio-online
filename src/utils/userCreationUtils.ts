
import { supabase } from '@/integrations/supabase/client';

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'user' | 'admin' | 'kitchen' | 'super_admin';
}

export const createUserWithRole = async (userData: CreateUserData) => {
  console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
  
  // 1. Criar usuário via signUp
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

  // 2. Aguardar para garantir que os triggers foram executados
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 3. Se o papel desejado não é 'user', atualizar o papel
  if (userData.role !== 'user') {
    console.log('Updating user role to:', userData.role);
    
    // Primeiro, tentar atualizar se já existe
    const { error: updateError } = await supabase
      .from('user_roles')
      .update({ role: userData.role })
      .eq('user_id', authData.user.id);

    if (updateError) {
      console.error('Error updating role:', updateError);
      
      // Se a atualização falhou, tentar inserir diretamente
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: userData.role
        });

      if (insertError && !insertError.message?.includes('duplicate key')) {
        console.error('Error inserting role:', insertError);
        // Não bloqueia o fluxo, pois o usuário foi criado
      } else if (insertError) {
        console.log('Role already exists, ignoring duplicate error');
      } else {
        console.log('Role inserted successfully:', userData.role);
      }
    } else {
      console.log('Role updated successfully:', userData.role);
    }
  }

  // 4. Verificar e criar perfil se necessário
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', authData.user.id)
    .single();

  if (profileCheckError && profileCheckError.code !== 'PGRST116') {
    console.error('Error checking profile existence:', profileCheckError);
  }

  if (!existingProfile) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: userData.fullName,
        phone: userData.phone
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    } else {
      console.log('Profile created successfully');
    }
  } else {
    console.log('Profile already exists');
  }

  return authData.user;
};

export const createUserWithRestaurant = async (
  userData: CreateUserData, 
  restaurantId: string
) => {
  const user = await createUserWithRole(userData);

  // 5. Associar ao restaurante se fornecido
  console.log('Associating user to restaurant:', restaurantId);
  
  const { data: existingAssociation, error: associationCheckError } = await supabase
    .from('user_restaurants')
    .select('id')
    .eq('user_id', user.id)
    .eq('restaurant_id', restaurantId)
    .single();

  if (associationCheckError && associationCheckError.code !== 'PGRST116') {
    console.error('Error checking restaurant association:', associationCheckError);
  }

  if (!existingAssociation) {
    const { error: restaurantError } = await supabase
      .from('user_restaurants')
      .insert({
        user_id: user.id,
        restaurant_id: restaurantId
      });

    if (restaurantError) {
      console.error('Error associating user to restaurant:', restaurantError);
      throw new Error('Usuário criado, mas não foi possível associá-lo ao restaurante.');
    } else {
      console.log('User associated to restaurant successfully');
    }
  } else {
    console.log('User already associated to restaurant');
  }

  return user;
};
