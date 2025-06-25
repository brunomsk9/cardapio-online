
import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationPopup from './NotificationPopup';
import { Database } from '@/integrations/supabase/types';

type Notification = Database['public']['Tables']['notifications']['Row'];

const NotificationManager = () => {
  const { notifications } = useNotifications();
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Quando há uma nova notificação, adiciona à lista de notificações ativas
    const latestNotification = notifications[0];
    if (latestNotification && !latestNotification.read) {
      setActiveNotifications(prev => {
        // Evita duplicatas
        if (prev.some(n => n.id === latestNotification.id)) {
          return prev;
        }
        return [...prev, latestNotification];
      });
    }
  }, [notifications]);

  const handleCloseNotification = (notificationId: string) => {
    setActiveNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  };

  const handleMarkAsRead = (notificationId: string) => {
    // A lógica de marcar como lida é tratada pelo hook useNotifications
    // Aqui só precisamos remover da lista ativa
    handleCloseNotification(notificationId);
  };

  return (
    <>
      {activeNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            position: 'fixed',
            top: `${4 + index * 120}px`,
            right: '16px',
            zIndex: 50 - index
          }}
        >
          <NotificationPopup
            notification={notification}
            onClose={() => handleCloseNotification(notification.id)}
            onMarkAsRead={handleMarkAsRead}
            autoClose={true}
            autoCloseDelay={5000}
          />
        </div>
      ))}
    </>
  );
};

export default NotificationManager;
