import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  description?: string;
  size?: number;
}

export function QRCodeGenerator({ 
  url, 
  title = "Scan to Continue",
  description = "Open on your mobile device",
  size = 256 
}: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();

    canvas.width = size + 40;
    canvas.height = size + 40;

    img.onload = () => {
      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 20, 20);
      
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'ai-career-agent-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success('QR code downloaded!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyLink();
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4 border-2 border-gray-100">
        <QRCodeSVG
          id="qr-code-svg"
          value={url}
          size={size}
          level="H"
          includeMargin={true}
          fgColor="#1E3A8A"
          bgColor="#FFFFFF"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={downloadQR} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button onClick={copyLink} variant="outline" className="flex-1">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button onClick={shareQR} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <div className="p-3 bg-gray-50 rounded text-xs text-gray-600 break-all text-center">
        {url}
      </div>
    </Card>
  );
}
