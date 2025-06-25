
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface WhatsAppMessageFormProps {
  whatsappMessage: string;
  saving: boolean;
  onMessageChange: (value: string) => void;
  onResetMessage: () => void;
  onSubmit: () => void;
}

const WhatsAppMessageForm = ({ 
  whatsappMessage, 
  saving, 
  onMessageChange, 
  onResetMessage, 
  onSubmit 
}: WhatsAppMessageFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="whatsapp_message">Modelo da Mensagem</Label>
        <Textarea
          id="whatsapp_message"
          value={whatsappMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Digite sua mensagem personalizada..."
          rows={15}
          className="font-mono text-sm"
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Variáveis Disponíveis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div><code>{'{restaurant_name}'}</code> - Nome do restaurante</div>
          <div><code>{'{order_id}'}</code> - ID do pedido</div>
          <div><code>{'{customer_name}'}</code> - Nome do cliente</div>
          <div><code>{'{customer_phone}'}</code> - Telefone do cliente</div>
          <div><code>{'{customer_email}'}</code> - Email do cliente</div>
          <div><code>{'{delivery_address}'}</code> - Endereço de entrega</div>
          <div><code>{'{order_items}'}</code> - Lista de itens do pedido</div>
          <div><code>{'{total}'}</code> - Valor total</div>
          <div><code>{'{payment_method}'}</code> - Forma de pagamento</div>
          <div><code>{'{notes}'}</code> - Observações (se houver)</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onResetMessage}
          className="flex items-center gap-2"
        >
          Restaurar Padrão
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar Mensagem'}
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppMessageForm;
