
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ShoppingBag, Clock } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationPopupProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationPopup = ({ notification, onClose, onMarkAsRead }: NotificationPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onMarkAsRead(notification.id);
      onClose();
    }, 300);
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'new_order':
        return <ShoppingBag className="h-5 w-5 text-orange-500" />;
      case 'status_change':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'new_order':
        return 'border-l-orange-500 bg-orange-50';
      case 'status_change':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <Card className={`max-w-sm border-l-4 ${getNotificationColor()} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getNotificationIcon()}
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.created_at || '').toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPopup;
