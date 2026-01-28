
import { useEffect } from 'react';
import { Database } from '@/integrations/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantTheme {
  primaryColor: string;
  secondaryColor: string;
  heroImageUrl: string | null;
}

const DEFAULT_THEME: RestaurantTheme = {
  primaryColor: '#FF521D',
  secondaryColor: '#282828',
  heroImageUrl: null
};

// Convert hex color to HSL values for CSS variables
const hexToHSL = (hex: string): string => {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const useRestaurantTheme = (restaurant: Restaurant | null) => {
  useEffect(() => {
    if (!restaurant) {
      // Reset to default theme
      applyTheme(DEFAULT_THEME);
      return;
    }

    const theme: RestaurantTheme = {
      primaryColor: (restaurant as any).primary_color || DEFAULT_THEME.primaryColor,
      secondaryColor: (restaurant as any).secondary_color || DEFAULT_THEME.secondaryColor,
      heroImageUrl: (restaurant as any).hero_image_url || DEFAULT_THEME.heroImageUrl
    };

    applyTheme(theme);

    // Cleanup: reset theme when component unmounts
    return () => {
      applyTheme(DEFAULT_THEME);
    };
  }, [restaurant]);

  const applyTheme = (theme: RestaurantTheme) => {
    const root = document.documentElement;
    
    // Apply primary color as CSS variable (HSL format for Tailwind)
    root.style.setProperty('--koombo-laranja', theme.primaryColor);
    root.style.setProperty('--koombo-grafite', theme.secondaryColor);
    
    // Also set the HSL values for semantic tokens
    root.style.setProperty('--primary', hexToHSL(theme.primaryColor));
    root.style.setProperty('--koombo-laranja-hsl', hexToHSL(theme.primaryColor));
    root.style.setProperty('--koombo-grafite-hsl', hexToHSL(theme.secondaryColor));
  };

  const getTheme = (): RestaurantTheme => {
    if (!restaurant) return DEFAULT_THEME;
    
    return {
      primaryColor: (restaurant as any).primary_color || DEFAULT_THEME.primaryColor,
      secondaryColor: (restaurant as any).secondary_color || DEFAULT_THEME.secondaryColor,
      heroImageUrl: (restaurant as any).hero_image_url || DEFAULT_THEME.heroImageUrl
    };
  };

  return { getTheme };
};

export const getRestaurantTheme = (restaurant: Restaurant | null): RestaurantTheme => {
  if (!restaurant) return DEFAULT_THEME;
  
  return {
    primaryColor: (restaurant as any).primary_color || DEFAULT_THEME.primaryColor,
    secondaryColor: (restaurant as any).secondary_color || DEFAULT_THEME.secondaryColor,
    heroImageUrl: (restaurant as any).hero_image_url || DEFAULT_THEME.heroImageUrl
  };
};
