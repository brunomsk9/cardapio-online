import { useEffect, useCallback, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseFormPersistenceOptions<T> {
  formKey: string;
  form: UseFormReturn<T>;
  enabled?: boolean;
  excludeFields?: (keyof T)[];
}

export const useFormPersistence = <T extends Record<string, any>>({
  formKey,
  form,
  enabled = true,
  excludeFields = []
}: UseFormPersistenceOptions<T>) => {
  const storageKey = `form_draft_${formKey}`;
  const hasRestoredRef = useRef(false);
  const watchedValues = form.watch();

  // Restore saved data on mount or when enabled changes to true
  useEffect(() => {
    if (!enabled) {
      // Reset the flag when disabled so it can restore again when re-enabled
      hasRestoredRef.current = false;
      return;
    }

    if (hasRestoredRef.current) return;

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const filteredData: any = {};
        
        // Only restore fields that are not excluded
        Object.keys(parsed).forEach((key) => {
          if (!excludeFields.includes(key as keyof T)) {
            filteredData[key] = parsed[key];
          }
        });

        form.reset(filteredData);
        hasRestoredRef.current = true;
      } catch (error) {
        console.error('Error restoring form data:', error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [enabled, storageKey, form, excludeFields]);

  // Auto-save on changes
  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      const dataToSave: any = {};
      
      Object.keys(watchedValues).forEach((key) => {
        if (!excludeFields.includes(key as keyof T)) {
          const value = watchedValues[key as keyof T];
          // Only save non-empty values
          if (value !== '' && value !== null && value !== undefined && value !== 0) {
            dataToSave[key] = value;
          }
        }
      });

      // Only save if there's meaningful data
      if (Object.keys(dataToSave).length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [watchedValues, enabled, storageKey, excludeFields]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(storageKey);
    hasRestoredRef.current = false;
  }, [storageKey]);

  // Check if form has unsaved data
  const hasUnsavedData = useCallback((): boolean => {
    const values = form.getValues();
    
    return Object.keys(values).some((key) => {
      if (excludeFields.includes(key as keyof T)) return false;
      
      const value = values[key as keyof T];
      return value !== '' && value !== null && value !== undefined && value !== 0;
    });
  }, [form, excludeFields]);

  return {
    clearSavedData,
    hasUnsavedData
  };
};
