import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { BarChart3, TrendingUp, Users, Eye, Calendar } from 'lucide-react';

interface QRScan {
  id: string;
  type: string;
  timestamp: string;
  device: string;
  location?: string;
}

interface QRAnalyticsProps {
  userId: string;
}

export function QRAnalytics({ userId }: QRAnalyticsProps) {
  const [scans, setScans] = useState([] as QRScan[]);
  const [stats, setStats] = useState({
    totalScans: 0,
    todayScans: 0,
    weekScans: 0,
    uniqueUsers: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Load analytics data
    loadAnalytics();
    
    // Track QR scan if coming from QR code
    const params = new URLSearchParams(window.location.search);
    if (params.get('qr')) {
      trackQRScan(params.get('qr') || 'unknown');
    }
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      // In production, fetch from API
      // const response = await fetch(`/api/analytics/qr/${userId}`);
      // const data = await response.json();
      
      // Mock data for now
      const mockScans: QRScan[] = [
        {
          id: '1',
          type: 'profile',
          timestamp: new Date().toISOString(),
          device: 'iPhone 14',
          location: 'San Francisco, CA'
        },
        {
          id: '2',
          type: 'referral',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          device: 'Samsung Galaxy',
          location: 'New York, NY'
        },
        {
          id: '3',
          type: 'desktop-to-mobile',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          device: 'iPhone 13',
          location: 'Austin, TX'
        }
      ];

      setScans(mockScans);
      setStats({
        totalScans: 127,
        todayScans: 8,
        weekScans: 45,
        uniqueUsers: 89,
        conversionRate: 32
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const trackQRScan = async (qrType: string) => {
    try {
      // In production, send to API
      // await fetch('/api/analytics/qr-scan', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     userId,
      //     type: qrType,
      //     timestamp: new Date().toISOString(),
      //     userAgent: navigator.userAgent
      //   })
      // });

      console.log('QR Scan tracked:', qrType);
    } catch (error) {
      console.error('Error tracking QR scan:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-600">Total Scans</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalScans}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">Today</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.todayScans}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-600">This Week</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.weekScans}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-gray-600">Unique Users</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.uniqueUsers}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-pink-600" />
            <span className="text-xs text-gray-600">Conversion</span>
          </div>
          <div className="text-2xl font-bold text-pink-600">{stats.conversionRate}%</div>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent QR Code Scans</h3>
        
        {scans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No scans yet. Share your QR codes to start tracking!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium capitalize">{scan.type.replace('-', ' ')}</div>
                    <div className="text-sm text-gray-600">
                      {scan.device} • {scan.location}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(scan.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Scan Types Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scans by Type</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Profile QR</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Referral QR</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600" style={{ width: '30%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Desktop to Mobile</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold mb-3">📊 Insights</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600">✅</span>
            <span>Your QR codes are performing <strong>32% above average</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">📈</span>
            <span>Scans increased by <strong>15% this week</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-600">🎯</span>
            <span>Best performing: <strong>Profile QR Code</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-600">💡</span>
            <span>Tip: Share your referral QR more to increase earnings!</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
