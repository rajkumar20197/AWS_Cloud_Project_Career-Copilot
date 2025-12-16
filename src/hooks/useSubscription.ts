import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';

export interface Subscription {
    id: string;
    planId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
}

export interface Usage {
    jobApplications: number;
    resumeOptimizations: number;
    interviewPrep: number;
    aiCoachingSessions: number;
}

/**
 * Custom hook for managing subscription data and actions
 */
export function useSubscription(userId: string) {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [usage, setUsage] = useState<Usage | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

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

    useEffect(() => {
        loadSubscriptionData();
    }, [userId]);

    const cancelSubscription = async () => {
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

    const reactivateSubscription = async () => {
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

    const plan = subscription ? subscriptionService.getPlanById(subscription.planId) : null;

    return {
        subscription,
        usage,
        paymentMethods,
        invoices,
        loading,
        actionLoading,
        plan,
        cancelSubscription,
        reactivateSubscription,
        refreshData: loadSubscriptionData,
    };
}
