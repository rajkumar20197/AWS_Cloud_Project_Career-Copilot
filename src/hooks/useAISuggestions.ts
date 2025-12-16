import { useMemo } from 'react';
import { toast } from 'sonner';
import type { User } from '../types';
import type { AISuggestion } from '../components/profile/AIAgentSuggestions';

/**
 * Custom hook for generating AI-powered profile suggestions
 * Analyzes user profile and returns actionable recommendations
 */
export function useAISuggestions(user: User): AISuggestion[] {
    return useMemo(() => {
        const suggestions: (AISuggestion | false)[] = [
            // Suggestion 1: Add professional photo
            !user.avatar && {
                id: 'photo',
                title: 'Add a professional photo',
                description: 'Profiles with photos get 14x more views',
                reason: 'Recruiters are more likely to engage with complete profiles that have a professional photo',
                impact: 'high' as const,
                category: 'profile' as const,
                icon: '📸',
                action: () => {
                    document.getElementById('profile-avatar')?.scrollIntoView({ behavior: 'smooth' });
                },
            },

            // Suggestion 2: Add more skills
            user.skills.length < 8 && {
                id: 'skills',
                title: `Add ${8 - user.skills.length} more skills`,
                description: 'Based on your target role, consider: TypeScript, AWS, Docker',
                reason: 'More skills improve job matching accuracy and increase your visibility in searches',
                impact: 'medium' as const,
                category: 'skills' as const,
                icon: '💼',
                action: () => {
                    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
                },
            },

            // Suggestion 3: Complete target role
            !user.targetRole && {
                id: 'targetRole',
                title: 'Define your target role',
                description: 'Help us match you with the right opportunities',
                reason: 'Knowing your target role allows our AI to provide more accurate job recommendations',
                impact: 'high' as const,
                category: 'profile' as const,
                icon: '🎯',
                action: () => {
                    document.getElementById('targetRole')?.scrollIntoView({ behavior: 'smooth' });
                },
            },

            // Suggestion 4: Set salary expectations
            !user.preferences?.salaryRange && {
                id: 'salary',
                title: 'Set salary expectations',
                description: 'Get matched with jobs in your desired range',
                reason: 'Salary expectations help filter opportunities that match your financial goals',
                impact: 'medium' as const,
                category: 'preferences' as const,
                icon: '💰',
                action: () => {
                    document.getElementById('salaryMin')?.scrollIntoView({ behavior: 'smooth' });
                },
            },

            // Suggestion 5: Add location preferences
            (!user.preferences?.locations || user.preferences.locations.length === 0) && {
                id: 'locations',
                title: 'Add location preferences',
                description: 'Specify where you want to work',
                reason: 'Location preferences ensure you only see relevant opportunities in your desired areas',
                impact: 'medium' as const,
                category: 'preferences' as const,
                icon: '📍',
                action: () => {
                    toast.info('Scroll to Preferences tab to add locations');
                },
            },

            // Suggestion 6: Connect LinkedIn
            {
                id: 'linkedin',
                title: 'Connect LinkedIn',
                description: 'Boost credibility and get profile insights',
                reason: 'LinkedIn integration helps verify your experience and expands your network',
                impact: 'low' as const,
                category: 'preferences' as const,
                icon: '🔗',
                action: () => {
                    toast.info('LinkedIn integration coming soon!');
                },
            },

            // Suggestion 7: Enable job alerts
            !user.preferences?.jobAlerts && {
                id: 'jobAlerts',
                title: 'Enable job alerts',
                description: 'Get notified about new matching opportunities',
                reason: 'Job alerts ensure you never miss opportunities that match your profile',
                impact: 'medium' as const,
                category: 'preferences' as const,
                icon: '🔔',
                action: () => {
                    toast.info('Go to Notifications tab to enable job alerts');
                },
            },
        ];

        // Filter out false values and return only valid suggestions
        return suggestions.filter(Boolean) as AISuggestion[];
    }, [user]);
}
