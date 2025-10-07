import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useOrderNotificationSound = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const playNotificationSound = () => {
      if (!audioContextRef.current) return;

      const audioContext = audioContextRef.current;
      
      // Create a pleasant notification sound using Web Audio API
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound - pleasant notification tone
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Start frequency
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);

      // Volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Repeat for double beep effect
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator2.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);

        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 200);
    };

    console.log('🔔 Setting up order notification listener');

    // Subscribe to new orders using Realtime
    const channel = supabase
      .channel('new-orders-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('🆕 New order received!', payload);
          
          // Play sound
          playNotificationSound();

          // Show toast notification
          const order = payload.new as any;
          toast({
            title: "🔔 Novo Pedido!",
            description: `Pedido de ${order.customer_name} - R$ ${order.total.toFixed(2)}`,
            duration: 5000,
          });
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      console.log('🔕 Cleaning up order notification listener');
      supabase.removeChannel(channel);
    };
  }, [enabled]);

  return null;
};
