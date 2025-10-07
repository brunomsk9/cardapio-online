
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { createUser } from '@/utils/userCreationUtils';

interface FormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface UseUserCreationFormProps {
  onUserCreated: () => void;
  onClose: () => void;
}

const STORAGE_KEY = 'form_draft_user_creation';

export const useUserCreationForm = ({ onUserCreated, onClose }: UseUserCreationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  // Restore saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error restoring form data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Auto-save on changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only save if there's meaningful data
      if (formData.email || formData.fullName || formData.phone) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasUnsavedData = useCallback((): boolean => {
    return !!(formData.email || formData.fullName || formData.phone || formData.password);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUser(formData);

      toast({
        title: "Usuário criado com sucesso!",
        description: `${formData.fullName} foi criado. Um email de confirmação foi enviado para ${formData.email}.`,
      });

      // Clear saved data and reset form
      clearSavedData();
      setFormData({
        email: '',
        password: '',
        fullName: '',
        phone: ''
      });

      onUserCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      let errorMessage = error.message;
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado no sistema.';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Por favor, insira um email válido.';
      } else if (error.message?.includes('duplicate key value')) {
        errorMessage = 'Erro interno: dados duplicados no sistema. Tente novamente.';
      } else if (error.message?.includes('Database error saving new user')) {
        errorMessage = 'Erro interno do banco de dados. Tente novamente em alguns segundos.';
      }
      
      toast({
        title: "Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    loading,
    handleSubmit,
    handleInputChange,
    clearSavedData,
    hasUnsavedData
  };
};
