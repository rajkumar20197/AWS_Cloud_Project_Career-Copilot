import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { CreditCard, Lock, Shield } from 'lucide-react';
import { subscriptionService, subscriptionPlans } from '../services/subscriptionService';

interface PaymentFormProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ planId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
  });

  const plan = subscriptionPlans.find(p => p.id === planId);

  useEffect(() => {
    // Initialize Stripe Elements here in a real implementation
    // This is a mock implementation for demonstration
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
    setError('');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 13) {
      setError('Please enter a valid card number');
      return false;
    }
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      setError('Please enter a valid expiry date');
      return false;
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    if (!paymentData.cardholderName.trim()) {
      setError('Please enter the cardholder name');
      return false;
    }
    if (!paymentData.billingAddress.line1.trim()) {
      setError('Please enter your billing address');
      return false;
    }
    if (!paymentData.billingAddress.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!paymentData.billingAddress.postalCode.trim()) {
      setError('Please enter your postal code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // In a real implementation, this would:
      // 1. Create a payment method with Stripe
      // 2. Create the subscription
      // 3. Handle 3D Secure if required
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Invalid plan selected. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{plan.name} Plan</div>
              <div className="text-sm text-muted-foreground">{plan.description}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${plan.price}</div>
              <div className="text-sm text-muted-foreground">per {plan.interval}</div>
            </div>
          </div>
          
          {plan.popular && (
            <Badge className="mt-2">Most Popular Choice</Badge>
          )}
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Your payment information is secure and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                  required
                  disabled={loading}
                />
              </div>

              {/* CVV */}
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="line1">Address Line 1</Label>
              <Input
                id="line1"
                type="text"
                placeholder="123 Main Street"
                value={paymentData.billingAddress.line1}
                onChange={(e) => handleInputChange('billingAddress.line1', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  value={paymentData.billingAddress.city}
                  onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  value={paymentData.billingAddress.state}
                  onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="10001"
                value={paymentData.billingAddress.postalCode}
                onChange={(e) => handleInputChange('billingAddress.postalCode', e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Subscribe for ${plan.price}/{plan.interval}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};