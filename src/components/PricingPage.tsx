import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PricingTier {
  name: string;
  price: string;
  priceId: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    priceId: '',
    description: 'Perfect for getting started',
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      '10 AI requests per month',
      'Basic resume analysis',
      'Job search tips',
      'Interview question bank',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$9.99',
    priceId: 'pro',
    description: 'For serious job seekers',
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    features: [
      'Unlimited AI requests',
      'Advanced resume analysis',
      'Personalized job matching',
      'Custom cover letters',
      'Interview prep sessions',
      'Priority support',
      'Career roadmap',
    ],
  },
  {
    name: 'Premium',
    price: '$19.99',
    priceId: 'premium',
    description: 'Maximum career acceleration',
    icon: <Crown className="w-6 h-6" />,
    features: [
      'Everything in Pro',
      'One-on-one career coaching',
      'Resume review by experts',
      'LinkedIn profile optimization',
      'Salary negotiation guide',
      'Job offer comparison tool',
      'Exclusive job opportunities',
      'Priority job alerts',
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) {
      // Free tier - just redirect to signup
      window.location.href = '/signup';
      return;
    }

    setLoading(priceId);

    try {
      // Call backend to create checkout session
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ plan: priceId }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Career Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Invest in your future. Get the tools and guidance you need to land your dream job.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                tier.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4 text-white">
                {tier.icon}
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
              <p className="text-gray-600 mb-4">{tier.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                {tier.price !== '$0' && <span className="text-gray-600">/month</span>}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(tier.priceId)}
                disabled={loading === tier.priceId}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } ${loading === tier.priceId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === tier.priceId
                  ? 'Processing...'
                  : tier.price === '$0'
                  ? 'Get Started Free'
                  : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access
                until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and debit
                cards through our secure payment processor, Stripe.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Our Free plan gives you 10 AI requests per month to try out the platform. Upgrade
                anytime to unlock unlimited access.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Absolutely! You can change your plan at any time from your account settings. Changes
                take effect immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
