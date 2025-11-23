import { QRCodeGenerator } from './QRCodeGenerator';
import { Card } from './ui/card';
import { User, Briefcase, Mail, MapPin } from 'lucide-react';

interface ProfileQRCodeProps {
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  userLocation?: string;
}

export function ProfileQRCode({ 
  userId, 
  userName,
  userEmail,
  userRole,
  userLocation 
}: ProfileQRCodeProps) {
  const profileUrl = `${window.location.origin}/profile/${userId}`;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">My Profile QR Code</h3>
            <p className="text-sm text-gray-600">Share with recruiters and connections</p>
          </div>
        </div>

        {/* User Info Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{userName}</span>
            </div>
            {userRole && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{userRole}</span>
              </div>
            )}
            {userEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{userEmail}</span>
              </div>
            )}
            {userLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{userLocation}</span>
              </div>
            )}
          </div>
        </div>

        <QRCodeGenerator
          url={profileUrl}
          title="Scan to View Profile"
          description="Recruiters can scan this to see your full profile"
          size={240}
        />

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Pro Tip:</strong> Add this QR code to your resume, business cards, or LinkedIn profile!
          </p>
        </div>
      </Card>

      {/* Use Cases */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Where to Use This QR Code:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">📄</span>
            <span>Add to your resume header</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">💼</span>
            <span>Print on business cards</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">🎤</span>
            <span>Display at career fairs</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">📧</span>
            <span>Include in email signatures</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">🔗</span>
            <span>Share on LinkedIn profile</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
