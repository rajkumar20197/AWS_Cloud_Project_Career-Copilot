import React, { useState } from 'react';
import { AdminDashboard } from '../components/AdminDashboard';
import { AdminLogin } from '../components/AdminLogin';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { UpgradeButton } from '../components/UpgradeButton';
import { UniversalHeader } from '../components/UniversalHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export const TestComponents: React.FC = () => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    role: 'Admin'
  };

  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader
        user={mockUser}
        onLogout={() => console.log('Logout clicked')}
      />

      <div className="container mx-auto p-6 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎉 Implementation Test Page
              <Badge variant="outline">All Systems Operational</Badge>
            </CardTitle>
            <CardDescription>
              Testing all implemented components and systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={() => setActiveTab('admin-login')}
                variant={activeTab === 'admin-login' ? 'default' : 'outline'}
              >
                Admin Login
              </Button>
              <Button
                onClick={() => setActiveTab('admin')}
                variant={activeTab === 'admin' ? 'default' : 'outline'}
              >
                Admin Dashboard
              </Button>

              <Button
                onClick={() => setActiveTab('subscription')}
                variant={activeTab === 'subscription' ? 'default' : 'outline'}
              >
                Subscription System
              </Button>
            </div>

            <div className="flex gap-4">
              <UpgradeButton
                currentPlanId="starter"
                onUpgradeSuccess={() => console.log('Upgrade successful')}
              />
              <Button
                onClick={() => setShowSubscriptionModal(true)}
                variant="outline"
              >
                Open Subscription Modal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Component Display Area */}
        <div className="space-y-6">
          {activeTab === 'admin-login' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
              <AdminLogin onLoginSuccess={() => setActiveTab('admin')} />
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
              <AdminDashboard />
            </div>
          )}



          {activeTab === 'subscription' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Subscription System</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Features</CardTitle>
                  <CardDescription>
                    Complete payment and subscription management system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Starter Plan</CardTitle>
                        <CardDescription>$29/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>✅ AI Resume Optimization</li>
                          <li>✅ Basic Job Matching</li>
                          <li>✅ Interview Preparation</li>
                          <li>✅ Application Tracking</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-primary">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          Professional Plan
                          <Badge>Popular</Badge>
                        </CardTitle>
                        <CardDescription>$79/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>✅ Everything in Starter</li>
                          <li>✅ Advanced AI Job Matching</li>
                          <li>✅ Personalized Cover Letters</li>
                          <li>✅ Mock Interview Sessions</li>
                          <li>✅ Salary Negotiation Coaching</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Enterprise Plan</CardTitle>
                        <CardDescription>$199/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>✅ Everything in Professional</li>
                          <li>✅ Unlimited Job Applications</li>
                          <li>✅ Custom AI Training</li>
                          <li>✅ White-label Options</li>
                          <li>✅ API Access</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
        currentPlanId="starter"
        onSubscriptionSuccess={() => {
          setShowSubscriptionModal(false);
          console.log('Subscription successful!');
        }}
      />
    </div>
  );
};