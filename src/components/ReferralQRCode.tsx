import { QRCodeGenerator } from './QRCodeGenerator';
import { Card } from './ui/card';
import { Gift, Users, DollarSign, TrendingUp } from 'lucide-react';

interface ReferralQRCodeProps {
  referralCode: string;
  userName: string;
  referralCount?: number;
  referralCredits?: number;
}

export function ReferralQRCode({ 
  referralCode, 
  userName,
  referralCount = 0,
  referralCredits = 0
}: ReferralQRCodeProps) {
  const referralUrl = `${window.location.origin}/signup?ref=${referralCode}`;

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">My Referral QR Code</h3>
            <p className="text-sm text-gray-600">Share and earn rewards!</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{referralCount}</div>
            <div className="text-xs text-gray-600">Referrals</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <div className="text-2xl font-bold text-green-600">${referralCredits}</div>
            <div className="text-xs text-gray-600">Credits</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">50%</div>
            <div className="text-xs text-gray-600">Discount</div>
          </div>
        </div>

        {/* Referral Code Display */}
        <div className="bg-white rounded-lg p-4 mb-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Your Referral Code</p>
          <div className="text-3xl font-bold text-purple-600 tracking-wider">
            {referralCode}
          </div>
        </div>

        <QRCodeGenerator
          url={referralUrl}
          title="Scan to Get 10% Off"
          description="Your friends get 10% off, you get 50% off!"
          size={240}
        />

        {/* Offer Details */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-900">🎁 Referral Rewards:</h4>
          <div className="space-y-1 text-sm text-purple-800">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Your friend gets <strong>10% off</strong> first month</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>You get <strong>50% off</strong> 3-month plan</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Plus <strong>$50 credit</strong> per referral</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span><strong>Unlimited</strong> referrals!</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Sharing Tips */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">💡 How to Share:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span>📱</span>
            <span>Show QR code to friends in person</span>
          </div>
          <div className="flex items-start gap-2">
            <span>📧</span>
            <span>Email the QR code image</span>
          </div>
          <div className="flex items-start gap-2">
            <span>💬</span>
            <span>Share on WhatsApp/Telegram</span>
          </div>
          <div className="flex items-start gap-2">
            <span>📱</span>
            <span>Post on social media stories</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🖨️</span>
            <span>Print and display at events</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
