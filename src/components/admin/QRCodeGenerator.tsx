import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, QrCode, Copy, Check } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface QRCodeGeneratorProps {
  restaurant: Restaurant;
}

const QRCodeGenerator = ({ restaurant }: QRCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState<number>(256);
  
  // Generate the menu URL
  const menuUrl = restaurant.subdomain 
    ? `https://${restaurant.subdomain}.koombo.online`
    : `https://koombo.online`;

  const handleDownloadQR = (format: 'png' | 'svg') => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    
    if (format === 'svg') {
      // Download SVG
      const svg = document.getElementById('qr-code-svg');
      if (!svg) return;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode-${restaurant.subdomain || 'menu'}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      
      toast({
        title: "QR Code baixado!",
        description: "Arquivo SVG salvo com sucesso.",
      });
    } else {
      // Download PNG
      const svg = document.getElementById('qr-code-svg');
      if (!svg) return;
      
      // Create a canvas to convert SVG to PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = qrSize;
        canvas.height = qrSize;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `qrcode-${restaurant.subdomain || 'menu'}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(pngUrl);
          
          toast({
            title: "QR Code baixado!",
            description: "Arquivo PNG salvo com sucesso.",
          });
        });
      };
      
      img.src = url;
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    
    toast({
      title: "Link copiado!",
      description: "O link do cardápio foi copiado para a área de transferência.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code do Cardápio
        </CardTitle>
        <CardDescription>
          Compartilhe o cardápio digital através de QR Code. Perfeito para mesas, cartazes e materiais de marketing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {/* QR Code Display */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
            <QRCodeSVG
              id="qr-code-svg"
              value={menuUrl}
              size={qrSize}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* URL Display */}
          <div className="w-full">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <code className="flex-1 text-sm text-gray-700 truncate">
                {menuUrl}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Size Selector */}
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tamanho do QR Code
            </label>
            <select
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="128">Pequeno (128x128)</option>
              <option value="256">Médio (256x256)</option>
              <option value="512">Grande (512x512)</option>
              <option value="1024">Extra Grande (1024x1024)</option>
            </select>
          </div>

          {/* Download Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              onClick={() => handleDownloadQR('png')}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PNG
            </Button>
            <Button
              onClick={() => handleDownloadQR('svg')}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar SVG
            </Button>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-blue-900 text-sm">💡 Dicas de uso:</h4>
          <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
            <li>Imprima o QR Code em tamanho grande (A4 ou maior) para facilitar a leitura</li>
            <li>Use formato PNG para impressão e SVG para uso digital (pode ampliar sem perder qualidade)</li>
            <li>Coloque o QR Code em locais visíveis: mesas, cardápios físicos, fachada</li>
            <li>Inclua uma mensagem como "Escaneie para ver o cardápio digital"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
