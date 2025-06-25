
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

  // 2. Aguardar mais tempo para garantir que os triggers foram executados
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 3. Se o papel desejado não é 'user', precisamos gerenciar os papéis
  if (userData.role !== 'user') {
    console.log('Managing user role to:', userData.role);
    
    // Primeiro, verificar se já existe o papel 'user' (criado pelo trigger)
    const { data: existingRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id);

    console.log('Existing roles:', existingRoles);

    // Se já existe o papel 'user', removê-lo antes de adicionar o novo
    if (existingRoles?.some(r => r.role === 'user')) {
      console.log('Removing default user role');
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', authData.user.id)
        .eq('role', 'user');

      if (deleteError) {
        console.error('Error removing default user role:', deleteError);
        // Não falha o processo, apenas loga o erro
      }
    }

    // Agora inserir o papel desejado
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: userData.role
      });

    if (insertError) {
      console.error('Error inserting role:', insertError);
      // Se falhar, tentar atualizar o papel existente
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: userData.role })
        .eq('user_id', authData.user.id);

      if (updateError) {
        console.error('Error updating role:', updateError);
        throw new Error(`Usuário criado, mas não foi possível definir o papel como ${userData.role}`);
      } else {
        console.log('Role updated successfully:', userData.role);
      }
    } else {
      console.log('Role inserted successfully:', userData.role);
    }
  }

  // 4. Verificar e atualizar perfil se necessário
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('id, full_name, phone')
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
      throw new Error('Usuário criado, mas não foi possível criar o perfil');
    } else {
      console.log('Profile created successfully');
    }
  } else {
    // Atualizar perfil existente se necessário
    const needsUpdate = 
      existingProfile.full_name !== userData.fullName || 
      existingProfile.phone !== userData.phone;

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: userData.fullName,
          phone: userData.phone
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
      } else {
        console.log('Profile updated successfully');
      }
    } else {
      console.log('Profile already up to date');
    }
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
