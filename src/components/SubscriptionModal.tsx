import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { subscriptionService, subscriptionPlans } from '../services/subscriptionService';
import { PaymentForm } from './PaymentForm';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId?: string;
  onSubscriptionSuccess?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onOpenChange,
  currentPlanId,
  onSubscriptionSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !selectedPlan) {
      // Auto-select recommended plan
      const recommended = subscriptionService.getUpgradeRecommendation(currentPlanId);
      if (recommended) {
        setSelectedPlan(recommended.id);
      }
    }
  }, [open, currentPlanId, selectedPlan]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(false);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    onSubscriptionSuccess?.();
    onOpenChange(false);
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return <Zap className="h-5 w-5" />;
      case 'professional': return <Star className="h-5 w-5" />;
      case 'enterprise': return <Crown className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'starter': return 'text-blue-600';
      case 'professional': return 'text-purple-600';
      case 'enterprise': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const isCurrentPlan = (planId: string) => planId === currentPlanId;
  const isUpgrade = (planId: string) => {
    if (!currentPlanId) return true;
    const currentIndex = subscriptionPlans.findIndex(p => p.id === currentPlanId);
    const planIndex = subscriptionPlans.findIndex(p => p.id === planId);
    return planIndex > currentIndex;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {showPayment ? 'Complete Your Subscription' : 'Choose Your Plan'}
          </DialogTitle>
          <DialogDescription>
            {showPayment 
              ? 'Enter your payment details to activate your subscription'
              : 'Select the perfect plan for your career goals'
            }
          </DialogDescription>
        </DialogHeader>

        {showPayment && selectedPlan ? (
          <PaymentForm
            planId={selectedPlan}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  } ${plan.popular ? 'border-primary' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto mb-2 ${getPlanColor(plan.id)}`}>
                      {getPlanIcon(plan.id)}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.interval}</span>
                    </div>

                    {isCurrentPlan(plan.id) && (
                      <Badge variant="outline" className="mt-2">
                        Current Plan
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}

                    {/* Usage Limits */}
                    <div className="pt-3 border-t space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Monthly Limits
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          Job Applications: {plan.limits.jobApplications === -1 ? 'Unlimited' : plan.limits.jobApplications}
                        </div>
                        <div>
                          Resume Optimizations: {plan.limits.resumeOptimizations === -1 ? 'Unlimited' : plan.limits.resumeOptimizations}
                        </div>
                        <div>
                          Interview Prep: {plan.limits.interviewPrep === -1 ? 'Unlimited' : plan.limits.interviewPrep}
                        </div>
                        <div>
                          AI Sessions: {plan.limits.aiCoachingSessions === -1 ? 'Unlimited' : plan.limits.aiCoachingSessions}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              
              <div className="flex items-center gap-3">
                {selectedPlan && (
                  <div className="text-sm text-muted-foreground">
                    {isCurrentPlan(selectedPlan) 
                      ? 'This is your current plan'
                      : isUpgrade(selectedPlan)
                      ? 'Upgrade to unlock more features'
                      : 'Downgrade available'
                    }
                  </div>
                )}
                
                <Button 
                  onClick={handleContinue}
                  disabled={!selectedPlan || isCurrentPlan(selectedPlan)}
                  className="min-w-[120px]"
                >
                  {isCurrentPlan(selectedPlan) 
                    ? 'Current Plan'
                    : isUpgrade(selectedPlan)
                    ? 'Upgrade Now'
                    : 'Change Plan'
                  }
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center pt-4 border-t">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Cancel anytime
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Secure payment
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Instant activation
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};