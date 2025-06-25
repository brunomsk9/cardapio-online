
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: Array<{ role: string }>;
  user_restaurants?: Array<{ restaurant: { name: string } }>;
  email?: string;
};

export const useUsersData = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const syncUsersWithAuth = async () => {
    try {
      setSyncing(true);
      console.log('Iniciando sincronização de usuários...');
      
      // Buscar todos os usuários da tabela auth via função RPC
      const { data: authUsers, error: authError } = await supabase
        .rpc('get_all_users_profiles');

      if (authError) {
        console.error('Erro ao buscar usuários auth:', authError);
        toast({
          title: "Erro na sincronização",
          description: "Não foi possível acessar os usuários da tabela de autenticação.",
          variant: "destructive",
        });
        return;
      }

      console.log('Usuários auth encontrados:', authUsers?.length || 0);

      // Buscar perfis existentes
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id');

      const existingIds = existingProfiles?.map(p => p.id) || [];
      
      // Identificar usuários sem perfil
      const usersWithoutProfile = authUsers?.filter(user => 
        !existingIds.includes(user.id)
      ) || [];

      console.log('Usuários sem perfil:', usersWithoutProfile.length);

      // Criar perfis para usuários sem perfil
      if (usersWithoutProfile.length > 0) {
        const profilesToCreate = usersWithoutProfile.map(user => ({
          id: user.id,
          full_name: user.email?.split('@')[0] || 'Usuário',
          phone: null
        }));

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profilesToCreate);

        if (insertError) {
          console.error('Erro ao criar perfis:', insertError);
          toast({
            title: "Erro na sincronização",  
            description: "Alguns perfis não puderam ser criados.",
            variant: "destructive",
          });
        } else {
          console.log('Perfis criados com sucesso:', profilesToCreate.length);
        }
      }

      // Buscar usuários atualizados
      await fetchUsers();
      
      toast({
        title: "Sincronização concluída!",
        description: `${usersWithoutProfile.length} perfis foram sincronizados.`,
      });

    } catch (error: any) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar todos os usuários.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Iniciando busca de usuários...');
      setLoading(true);
      
      // Buscar todos os perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
        toast({
          title: "Erro ao carregar perfis",
          description: profilesError.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Perfis encontrados:', profiles?.length || 0);

      // Buscar papéis dos usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Erro ao buscar papéis:', rolesError);
        toast({
          title: "Erro ao carregar papéis",
          description: rolesError.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Papéis encontrados:', userRoles?.length || 0);

      // Buscar associações usuário-restaurante
      const { data: userRestaurants, error: userRestaurantsError } = await supabase
        .from('user_restaurants')
        .select(`
          user_id,
          restaurant:restaurants(name)
        `);

      if (userRestaurantsError) {
        console.error('Erro ao buscar associações usuário-restaurante:', userRestaurantsError);
        console.log('Continuando sem as associações de restaurantes...');
      }

      console.log('Associações usuário-restaurante encontradas:', userRestaurants?.length || 0);

      // Buscar emails dos usuários via RPC
      const { data: userEmails, error: emailsError } = await supabase
        .rpc('get_users_emails', { user_ids: profiles?.map(p => p.id) || [] });

      if (emailsError) {
        console.error('Erro ao buscar emails:', emailsError);
      }

      console.log('Emails encontrados:', userEmails?.length || 0);

      // Combinar dados
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id).map(role => ({ role: role.role })) || [],
        user_restaurants: userRestaurants?.filter(ur => ur.user_id === profile.id) || [],
        email: userEmails?.find(email => email.user_id === profile.id)?.email || null
      })) || [];

      console.log('Usuários processados:', usersWithRoles.length);
      setUsers(usersWithRoles);

    } catch (error: any) {
      console.error('Erro geral na busca de usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Ocorreu um erro inesperado ao carregar os usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    syncing,
    fetchUsers,
    syncUsersWithAuth
  };
};
