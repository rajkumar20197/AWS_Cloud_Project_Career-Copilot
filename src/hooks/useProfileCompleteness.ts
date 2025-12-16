import { useMemo } from 'react';
import type { User } from '../types';

export interface ProfileSection {
    id: string;
    label: string;
    completed: boolean;
    weight: number;
}

/**
 * Custom hook for calculating profile completeness
 * Returns profile sections and completion percentage
 */
export function useProfileCompleteness(user: User) {
    const profileSections: ProfileSection[] = useMemo(
        () => [
            {
                id: 'photo',
                label: 'Profile Picture',
                completed: !!user.avatar,
                weight: 10
            },
            {
                id: 'phone',
                label: 'Phone Number',
                completed: false,
                weight: 5
            },
            {
                id: 'currentRole',
                label: 'Current Role',
                completed: !!user.currentRole,
                weight: 8
            },
            {
                id: 'targetRole',
                label: 'Target Role',
                completed: !!user.targetRole,
                weight: 8
            },
            {
                id: 'skills',
                label: 'Skills (minimum 5)',
                completed: user.skills.length >= 5,
                weight: 10
            },
            {
                id: 'experience',
                label: 'Years of Experience',
                completed: false,
                weight: 7
            },
            {
                id: 'education',
                label: 'Education',
                completed: false,
                weight: 7
            },
            {
                id: 'resume',
                label: 'Resume Upload',
                completed: false,
                weight: 8
            },
            {
                id: 'certifications',
                label: 'Certifications',
                completed: false,
                weight: 5
            },
            {
                id: 'portfolio',
                label: 'Portfolio URL',
                completed: false,
                weight: 5
            },
            {
                id: 'linkedin',
                label: 'LinkedIn Profile',
                completed: false,
                weight: 5
            },
            {
                id: 'github',
                label: 'GitHub Profile',
                completed: false,
                weight: 5
            },
            {
                id: 'salary',
                label: 'Salary Expectations',
                completed: !!user.preferences?.salaryRange,
                weight: 7
            },
            {
                id: 'location',
                label: 'Location Preferences',
                completed: user.preferences?.locations?.length > 0,
                weight: 5
            },
            {
                id: 'workAuth',
                label: 'Work Authorization',
                completed: false,
                weight: 5
            },
        ],
        [user]
    );

    const completionPercentage = useMemo(() => {
        const totalWeight = profileSections.reduce((sum, section) => sum + section.weight, 0);
        const completedWeight = profileSections
            .filter(section => section.completed)
            .reduce((sum, section) => sum + section.weight, 0);

        return Math.round((completedWeight / totalWeight) * 100);
    }, [profileSections]);

    const completedCount = useMemo(
        () => profileSections.filter(section => section.completed).length,
        [profileSections]
    );

    return {
        profileSections,
        completionPercentage,
        completedCount,
        totalCount: profileSections.length,
    };
}
