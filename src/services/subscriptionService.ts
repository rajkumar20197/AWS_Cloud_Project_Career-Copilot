interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    jobApplications: number;
    resumeOptimizations: number;
    interviewPrep: number;
    aiCoachingSessions: number;
  };
  stripePriceId: string;
  popular?: boolean;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}

interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for job seekers getting started',
    price: 29,
    interval: 'month',
    features: [
      'AI Resume Optimization',
      'Basic Job Matching',
      'Interview Preparation Tips',
      'Application Tracking',
      'Email Support',
    ],
    limits: {
      jobApplications: 50,
      resumeOptimizations: 5,
      interviewPrep: 10,
      aiCoachingSessions: 2,
    },
    stripePriceId: 'price_starter_monthly',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Advanced features for serious job seekers',
    price: 79,
    interval: 'month',
    features: [
      'Everything in Starter',
      'Advanced AI Job Matching',
      'Personalized Cover Letters',
      'Mock Interview Sessions',
      'Salary Negotiation Coaching',
      'Priority Support',
    ],
    limits: {
      jobApplications: 200,
      resumeOptimizations: 20,
      interviewPrep: 50,
      aiCoachingSessions: 10,
    },
    stripePriceId: 'price_professional_monthly',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Unlimited access for power users',
    price: 199,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited Job Applications',
      'Custom AI Training',
      'White-label Options',
      'API Access',
      'Dedicated Account Manager',
    ],
    limits: {
      jobApplications: -1, // Unlimited
      resumeOptimizations: -1,
      interviewPrep: -1,
      aiCoachingSessions: -1,
    },
    stripePriceId: 'price_enterprise_monthly',
  },
];

class SubscriptionService {
  private baseUrl = '/api/subscriptions';

  async getPlans(): Promise<SubscriptionPlan[]> {
    return subscriptionPlans;
  }

  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    try {
      const response = await fetch(`${this.baseUrl}/current?userId=${userId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch subscription');
      }
      return await response.json();
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  }

  async createSubscription(planId: string, paymentMethodId: string): Promise<{ clientSecret: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, paymentMethodId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: string, planId: string): Promise<Subscription> {
    try {
      const response = await fetch(`${this.baseUrl}/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<Subscription> {
    try {
      const response = await fetch(`${this.baseUrl}/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelAtPeriodEnd }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  async reactivateSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await fetch(`${this.baseUrl}/${subscriptionId}/reactivate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Reactivate subscription error:', error);
      throw error;
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      return await response.json();
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  }

  async addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove payment method');
      }
    } catch (error) {
      console.error('Remove payment method error:', error);
      throw error;
    }
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/${paymentMethodId}/default`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to set default payment method');
      }
    } catch (error) {
      console.error('Set default payment method error:', error);
      throw error;
    }
  }

  async getUsage(userId: string): Promise<{
    jobApplications: number;
    resumeOptimizations: number;
    interviewPrep: number;
    aiCoachingSessions: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/usage?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch usage');
      }
      return await response.json();
    } catch (error) {
      console.error('Get usage error:', error);
      throw error;
    }
  }

  async getInvoices(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      return await response.json();
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  }

  getPlanById(planId: string): SubscriptionPlan | undefined {
    return subscriptionPlans.find(plan => plan.id === planId);
  }

  isFeatureAvailable(subscription: Subscription | null, feature: keyof SubscriptionPlan['limits']): boolean {
    if (!subscription) return false;
    
    const plan = this.getPlanById(subscription.planId);
    if (!plan) return false;

    const limit = plan.limits[feature];
    return limit === -1; // Unlimited
  }

  canUseFeature(
    subscription: Subscription | null, 
    feature: keyof SubscriptionPlan['limits'], 
    currentUsage: number
  ): boolean {
    if (!subscription) return false;
    
    const plan = this.getPlanById(subscription.planId);
    if (!plan) return false;

    const limit = plan.limits[feature];
    if (limit === -1) return true; // Unlimited
    
    return currentUsage < limit;
  }

  getUpgradeRecommendation(currentPlanId: string | null): SubscriptionPlan | null {
    const currentPlan = currentPlanId ? this.getPlanById(currentPlanId) : null;
    
    if (!currentPlan) {
      return subscriptionPlans.find(plan => plan.popular) || subscriptionPlans[0];
    }

    const currentIndex = subscriptionPlans.findIndex(plan => plan.id === currentPlanId);
    if (currentIndex < subscriptionPlans.length - 1) {
      return subscriptionPlans[currentIndex + 1];
    }

    return null; // Already on highest plan
  }
}

export const subscriptionService = new SubscriptionService();