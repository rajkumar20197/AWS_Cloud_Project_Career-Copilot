import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Crown, Zap, ArrowUp } from 'lucide-react';
import { SubscriptionModal } from './SubscriptionModal';
import { subscriptionService } from '../services/subscriptionService';

interface UpgradeButtonProps {
  currentPlanId?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  showBadge?: boolean;
  className?: string;
  onUpgradeSuccess?: () => void;
}

export const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  currentPlanId,
  size = 'default',
  variant = 'default',
  showBadge = true,
  className,
  onUpgradeSuccess,
}) => {
  const [showModal, setShowModal] = useState(false);

  const recommendedPlan = subscriptionService.getUpgradeRecommendation(currentPlanId);
  
  // Don't show upgrade button if already on highest plan
  if (!recommendedPlan) {
    return null;
  }

  const getUpgradeIcon = () => {
    switch (recommendedPlan.id) {
      case 'professional': return <Zap className="h-4 w-4" />;
      case 'enterprise': return <Crown className="h-4 w-4" />;
      default: return <ArrowUp className="h-4 w-4" />;
    }
  };

  const getUpgradeText = () => {
    if (!currentPlanId) return 'Get Started';
    return `Upgrade to ${recommendedPlan.name}`;
  };

  const getBadgeText = () => {
    if (!currentPlanId) return 'Start Free Trial';
    
    const savings = calculateSavings();
    if (savings > 0) {
      return `Save $${savings}/month`;
    }
    
    return 'Unlock More Features';
  };

  const calculateSavings = () => {
    // This would calculate actual savings based on usage patterns
    // For now, return a mock value
    return recommendedPlan.id === 'professional' ? 25 : 50;
  };

  const handleUpgradeClick = () => {
    setShowModal(true);
  };

  const handleUpgradeSuccess = () => {
    setShowModal(false);
    onUpgradeSuccess?.();
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <Button
          size={size}
          variant={variant}
          onClick={handleUpgradeClick}
          className="flex items-center gap-2"
        >
          {getUpgradeIcon()}
          {getUpgradeText()}
        </Button>
        
        {showBadge && (
          <Badge 
            className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs px-2 py-1"
          >
            {getBadgeText()}
          </Badge>
        )}
      </div>

      <SubscriptionModal
        open={showModal}
        onOpenChange={setShowModal}
        currentPlanId={currentPlanId}
        onSubscriptionSuccess={handleUpgradeSuccess}
      />
    </>
  );
};