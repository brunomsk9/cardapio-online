
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface UserSyncButtonProps {
  onSync: () => Promise<void>;
  syncing: boolean;
}

const UserSyncButton = ({ onSync, syncing }: UserSyncButtonProps) => {
  return (
    <Button
      onClick={onSync}
      disabled={syncing}
      variant="outline"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Sincronizando...' : 'Sincronizar'}
    </Button>
  );
};

export default UserSyncButton;
