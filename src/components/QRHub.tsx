import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProfileQRCode } from './ProfileQRCode';
import { ReferralQRCode } from './ReferralQRCode';
import { CustomQRCode } from './CustomQRCode';
import { QRAnalytics } from './QRAnalytics';
import { QrCode, User, Gift, Palette, BarChart3 } from 'lucide-react';

interface QRHubProps {
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  userLocation?: string;
  referralCode?: string;
  referralCount?: number;
  referralCredits?: number;
}

export function QRHub({
  userId,
  userName,
  userEmail,
  userRole,
  userLocation,
  referralCode = 'DEMO2024',
  referralCount = 0,
  referralCredits = 0
}: QRHubProps) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">QR Code Hub</h1>
            <p className="text-gray-600">Manage all your QR codes in one place</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="referral" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">Referral</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Custom</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileQRCode
            userId={userId}
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            userLocation={userLocation}
          />
        </TabsContent>

        <TabsContent value="referral">
          <ReferralQRCode
            referralCode={referralCode}
            userName={userName}
            referralCount={referralCount}
            referralCredits={referralCredits}
          />
        </TabsContent>

        <TabsContent value="custom">
          <CustomQRCode />
        </TabsContent>

        <TabsContent value="analytics">
          <QRAnalytics userId={userId} />
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold mb-3">💡 Quick Tips</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span>📱</span>
            <span>QR codes work with any smartphone camera - no app needed!</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🎨</span>
            <span>Customize colors to match your personal brand</span>
          </div>
          <div className="flex items-start gap-2">
            <span>📊</span>
            <span>Track scans to see which QR codes perform best</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🖨️</span>
            <span>Print QR codes at least 2cm × 2cm for best results</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
