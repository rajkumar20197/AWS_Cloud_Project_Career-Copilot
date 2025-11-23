import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Download, Palette, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export function CustomQRCode() {
  const [url, setUrl] = useState(window.location.origin);
  const [fgColor, setFgColor] = useState('#1E3A8A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [errorLevel, setErrorLevel] = useState('H' as 'L' | 'M' | 'Q' | 'H');

  const colorPresets = [
    { name: 'Navy Blue', fg: '#1E3A8A', bg: '#FFFFFF' },
    { name: 'Purple', fg: '#7C3AED', bg: '#FFFFFF' },
    { name: 'Green', fg: '#059669', bg: '#FFFFFF' },
    { name: 'Red', fg: '#DC2626', bg: '#FFFFFF' },
    { name: 'Black', fg: '#000000', bg: '#FFFFFF' },
    { name: 'Dark Mode', fg: '#FFFFFF', bg: '#1F2937' },
  ];

  const downloadQR = () => {
    const svg = document.getElementById('custom-qr-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    canvas.width = size + 40;
    canvas.height = size + 40;

    img.onload = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'custom-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success('Custom QR code downloaded!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
          <Palette className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Custom QR Code Designer</h3>
          <p className="text-sm text-gray-600">Create your branded QR code</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <Label htmlFor="qr-url">URL or Text</Label>
            <Input
              id="qr-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fg-color">Foreground Color</Label>
              <div className="flex gap-2">
                <Input
                  id="fg-color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#FFFFFF"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <Label>Color Presets</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setFgColor(preset.fg);
                    setBgColor(preset.bg);
                  }}
                  className="p-2 border rounded hover:border-purple-500 transition-colors"
                  title={preset.name}
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-6 h-6 rounded" 
                      style={{ backgroundColor: preset.fg }}
                    />
                    <div 
                      className="w-6 h-6 rounded border" 
                      style={{ backgroundColor: preset.bg }}
                    />
                  </div>
                  <div className="text-xs mt-1">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Slider */}
          <div>
            <Label htmlFor="qr-size">Size: {size}px</Label>
            <input
              id="qr-size"
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Error Correction */}
          <div>
            <Label htmlFor="error-level">Error Correction Level</Label>
            <select
              id="error-level"
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%) - Recommended</option>
            </select>
          </div>

          {/* Options */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-margin"
              checked={includeMargin}
              onChange={(e) => setIncludeMargin(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="include-margin">Include margin</Label>
          </div>

          <Button onClick={downloadQR} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
            <Download className="w-4 h-4 mr-2" />
            Download Custom QR Code
          </Button>
        </div>

        {/* Preview */}
        <div>
          <Label>Preview</Label>
          <div 
            className="mt-2 p-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeSVG
              id="custom-qr-svg"
              value={url}
              size={Math.min(size, 300)}
              level={errorLevel}
              includeMargin={includeMargin}
              fgColor={fgColor}
              bgColor={bgColor}
            />
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> High error correction allows you to add a logo in the center!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
