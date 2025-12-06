import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Settings,
  Crown
} from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriptionModal } from './SubscriptionModal';

interface SubscriptionSettingsProps {
  userId: string;
}

interface Subscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

interface Usage {
  jobApplications: number;
  resumeOptimizations: number;
  interviewPrep: number;
  aiCoachingSessions: number;
}

export const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ userId }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, [userId]);

  const loadSubscriptionData = async () => {
    try {
      const [subData, usageData, paymentData, invoiceData] = await Promise.all([
        subscriptionService.getCurrentSubscription(userId),
        subscriptionService.getUsage(userId),
        subscriptionService.getPaymentMethods(userId),
        subscriptionService.getInvoices(userId),
      ]);

      setSubscription(subData);
      setUsage(usageData);
      setPaymentMethods(paymentData);
      setInvoices(invoiceData);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    setActionLoading('cancel');
    try {
      await subscriptionService.cancelSubscription(subscription.id);
      await loadSubscriptionData();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;
    
    setActionLoading('reactivate');
    try {
      await subscriptionService.reactivateSubscription(subscription.id);
      await loadSubscriptionData();
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'canceled': return 'text-red-600';
      case 'past_due': return 'text-yellow-600';
      case 'trialing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'canceled': return <XCircle className="h-4 w-4" />;
      case 'past_due': return <AlertTriangle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const plan = subscription ? subscriptionService.getPlanById(subscription.planId) : null;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription && plan ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 ${getStatusColor(subscription.status)}`}
                    >
                      {getStatusIcon(subscription.status)}
                      {subscription.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${plan.price}</div>
                  <div className="text-sm text-muted-foreground">per {plan.interval}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {subscription.cancelAtPeriodEnd 
                    ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                    : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  }
                </span>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Your subscription will be canceled at the end of the current billing period.
                    You'll continue to have access until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Change Plan
                </Button>
                
                {subscription.cancelAtPeriodEnd ? (
                  <Button 
                    onClick={handleReactivateSubscription}
                    disabled={actionLoading === 'reactivate'}
                  >
                    {actionLoading === 'reactivate' ? 'Reactivating...' : 'Reactivate'}
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelSubscription}
                    disabled={actionLoading === 'cancel'}
                  >
                    {actionLoading === 'cancel' ? 'Canceling...' : 'Cancel Subscription'}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to unlock premium features and unlimited access
              </p>
              <Button onClick={() => setShowUpgradeModal(true)}>
                Choose a Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {usage && plan && (
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your usage against your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(usage).map(([key, value]) => {
              const limit = plan.limits[key as keyof typeof plan.limits];
              const percentage = calculateUsagePercentage(value, limit);
              const isUnlimited = limit === -1;
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={getUsageColor(percentage)}>
                      {value} {isUnlimited ? '(Unlimited)' : `/ ${limit}`}
                    </span>
                  </div>
                  {!isUnlimited && (
                    <Progress value={percentage} className="h-2" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        **** **** **** {method.card.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {method.card.brand.toUpperCase()} • Expires {method.card.expMonth}/{method.card.expYear}
                      </div>
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="outline">Default</Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm">
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">No payment methods added</p>
              <Button variant="outline">Add Payment Method</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Download invoices and view payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      ${invoice.amount} - {invoice.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
              {invoices.length > 5 && (
                <Button variant="outline" size="sm">
                  View All Invoices
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No billing history available
            </p>
          )}
        </CardContent>
      </Card>

      <SubscriptionModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlanId={subscription?.planId}
        onSubscriptionSuccess={loadSubscriptionData}
      />
    </div>
  );
};