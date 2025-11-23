import { useState, useEffect } from 'react';
import { QRCodeGenerator } from './QRCodeGenerator';
import { Smartphone, X } from 'lucide-react';

export function ContinueOnMobile() {
  const [showQR, setShowQR] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Detect if user is on mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Get current URL
    setCurrentUrl(window.location.href);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't show on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Floating Button */}
      {!showQR && (
        <button
          onClick={() => setShowQR(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center gap-2 hover:scale-105"
          title="Continue on Mobile"
        >
          <Smartphone className="w-5 h-5" />
          <span className="hidden lg:inline font-medium">Continue on Mobile</span>
        </button>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
          onClick={() => setShowQR(false)}
        >
          <div 
            className="relative animate-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <QRCodeGenerator
              url={currentUrl}
              title="📱 Continue on Mobile"
              description="Scan this QR code with your phone camera to continue"
              size={280}
            />
            
            <div className="mt-4 text-center text-sm text-white bg-black/20 backdrop-blur-sm rounded-lg p-3">
              <p>💡 Tip: Point your phone camera at the QR code</p>
              <p className="text-xs mt-1 opacity-75">Works with iPhone & Android</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
