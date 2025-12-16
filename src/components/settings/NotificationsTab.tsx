import { Bell } from 'lucide-react';
import { Separator } from '../ui/separator';
import { FormSection } from './shared/FormSection';
import { SettingToggle } from './shared/SettingToggle';
import type { User } from '../../types';

interface NotificationsTabProps {
    user: User;
    onPreferencesUpdate: (updates: Partial<User['preferences']>) => void;
}

/**
 * Notifications Tab Component
 * Handles all notification preferences and settings
 */
export function NotificationsTab({ user, onPreferencesUpdate }: NotificationsTabProps) {
    return (
        <div className="space-y-4">
            <FormSection icon={Bell} title="Notification Settings">
                <div className="space-y-6">
                    {/* Job Alerts */}
                    <SettingToggle
                        title="Job Alerts"
                        description="Receive notifications when new jobs match your preferences"
                        checked={user.preferences.jobAlerts}
                        onCheckedChange={(checked) =>
                            onPreferencesUpdate({ jobAlerts: checked })
                        }
                    />

                    <Separator />

                    {/* Email Notifications */}
                    <SettingToggle
                        title="Email Notifications"
                        description="Get email updates about applications, interviews, and more"
                        checked={user.preferences.emailNotifications}
                        onCheckedChange={(checked) =>
                            onPreferencesUpdate({ emailNotifications: checked })
                        }
                    />

                    <Separator />

                    {/* Interview Reminders */}
                    <SettingToggle
                        title="Interview Reminders"
                        description="Automatic reminders before scheduled interviews"
                        checked={true}
                        onCheckedChange={() => { }}
                    />

                    <Separator />

                    {/* Weekly Progress Reports */}
                    <SettingToggle
                        title="Weekly Progress Reports"
                        description="Get a weekly summary of your job search activity"
                        checked={true}
                        onCheckedChange={() => { }}
                    />

                    <Separator />

                    {/* Market Intelligence Updates */}
                    <SettingToggle
                        title="Market Intelligence Updates"
                        description="Receive insights about salary trends and skill demand"
                        checked={true}
                        onCheckedChange={() => { }}
                    />
                </div>
            </FormSection>
        </div>
    );
}
