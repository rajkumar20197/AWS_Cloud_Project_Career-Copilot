import { useState } from 'react';
import { toast } from 'sonner';
import type { User } from '../types';

/**
 * Custom hook for managing profile settings state and actions
 * Handles user data updates, save operations, and avatar uploads
 */
export function useProfileSettings(initialUser: User) {
    const [user, setUser] = useState<User>(initialUser);
    const [saved, setSaved] = useState(false);

    /**
     * Save settings and show success notification
     */
    const handleSave = () => {
        setSaved(true);
        toast.success('Settings saved successfully!');
        setTimeout(() => setSaved(false), 3000);
    };

    /**
     * Handle avatar file upload
     * In production: upload to S3 and update user profile
     */
    const handleAvatarUpload = async (file: File): Promise<void> => {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Read file and update user avatar
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setUser(prev => ({ ...prev, avatar: result }));
            toast.success('Avatar updated successfully!');
        };
        reader.readAsDataURL(file);
    };

    /**
     * Update user data with partial updates
     */
    const updateUser = (updates: Partial<User>) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    /**
     * Update nested preferences
     */
    const updatePreferences = (updates: Partial<User['preferences']>) => {
        setUser(prev => ({
            ...prev,
            preferences: { ...prev.preferences, ...updates },
        }));
    };

    /**
     * Update salary range
     */
    const updateSalaryRange = (min?: number, max?: number) => {
        setUser(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                salaryRange: {
                    min: min ?? prev.preferences.salaryRange.min,
                    max: max ?? prev.preferences.salaryRange.max,
                },
            },
        }));
    };

    return {
        user,
        saved,
        handleSave,
        handleAvatarUpload,
        updateUser,
        updatePreferences,
        updateSalaryRange,
    };
}
