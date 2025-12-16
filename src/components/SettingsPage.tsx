/**
 * AI Career Agent Platform - Settings Page Component
 * Copyright (c) 2025 AI Career Agent Coach
 * 
 * Refactored for better maintainability and performance
 * Uses extracted hooks and tab components
 */

import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProfileCompleteness } from './profile/ProfileCompleteness';
import { AIAgentSuggestions } from './profile/AIAgentSuggestions';
import { SubscriptionSettings } from './SubscriptionSettings';
import { ProfileTab } from './settings/ProfileTab';
import { PreferencesTab } from './settings/PreferencesTab';
import { NotificationsTab } from './settings/NotificationsTab';
import { IntegrationsTab } from './settings/IntegrationsTab';
import { Save, CheckCircle2 } from 'lucide-react';
import { mockUser } from '../services/mockData';
import { toast } from 'sonner';

// Custom hooks
import { useProfileSettings } from '../hooks/useProfileSettings';
import { useProfileCompleteness } from '../hooks/useProfileCompleteness';
import { useAISuggestions } from '../hooks/useAISuggestions';

/**
 * Settings Page Component
 * Manages user profile, preferences, notifications, integrations, and billing
 */
export function SettingsPage() {
  // Use custom hooks for state management
  const {
    user,
    saved,
    handleSave,
    handleAvatarUpload,
    updateUser,
    updatePreferences,
    updateSalaryRange,
  } = useProfileSettings(mockUser);

  const { profileSections } = useProfileCompleteness(user);
  const aiSuggestions = useAISuggestions(user);

  // Handle section click for profile completeness
  const handleSectionClick = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle AI suggestion actions
  const handleDismissSuggestion = (id: string) => {
    toast.info('Suggestion dismissed');
  };

  const handleApplySuggestion = (id: string) => {
    toast.success('Suggestion applied!');
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings & Preferences</h1>
        <p className="text-slate-600">Manage your account and customize your experience</p>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <AIAgentSuggestions
          suggestions={aiSuggestions}
          onDismiss={handleDismissSuggestion}
          onApply={handleApplySuggestion}
        />
      )}

      {/* Profile Completeness */}
      <ProfileCompleteness sections={profileSections} onSectionClick={handleSectionClick} />

      {/* Tabs */}
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">💳 Billing</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <ProfileTab
            user={user}
            onUserUpdate={updateUser}
            onAvatarUpload={handleAvatarUpload}
          />
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <PreferencesTab
            user={user}
            onUserUpdate={updateUser}
            onSalaryUpdate={updateSalaryRange}
          />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <NotificationsTab user={user} onPreferencesUpdate={updatePreferences} />
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <IntegrationsTab user={user} />
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <SubscriptionSettings userId={user.id} />
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="min-w-32">
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
