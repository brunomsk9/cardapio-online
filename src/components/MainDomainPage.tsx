
import { useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import AuthModal from '@/components/auth/AuthModal';

interface MainDomainPageProps {
  user: SupabaseUser | null;
  isAdmin: boolean;
  isKitchen: boolean;
  onAdminClick: () => void;
  onSignOut: () => void;
  onAuthSuccess: () => void;
}

const MainDomainPage = ({ 
  user, 
  isAdmin, 
  isKitchen, 
  onAdminClick, 
  onSignOut, 
  onAuthSuccess 
}: MainDomainPageProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAdminClick = () => {
    setShowAuthModal(true);
    onAdminClick();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onAuthSuccess();
  };

  console.log('Rendering main domain page');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
        onAdminClick={handleAdminClick}
        user={user}
        onSignOut={onSignOut}
        isAdmin={isAdmin}
        isKitchen={isKitchen}
      />

      <HeroSection />
      <WhatsAppCTA />
      <FeaturesSection />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default MainDomainPage;
