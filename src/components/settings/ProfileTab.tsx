import { User } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ProfileAvatar } from '../profile/ProfileAvatar';
import { FormSection } from './shared/FormSection';
import type { User as UserType } from '../../types';

interface ProfileTabProps {
    user: UserType;
    onUserUpdate: (updates: Partial<UserType>) => void;
    onAvatarUpload: (file: File) => Promise<void>;
}

/**
 * Profile Tab Component
 * Handles user profile information including avatar, personal details, and skills
 */
export function ProfileTab({ user, onUserUpdate, onAvatarUpload }: ProfileTabProps) {
    return (
        <div className="space-y-4">
            {/* Profile Avatar Section */}
            <div className="p-6 border rounded-lg bg-white" id="profile-avatar">
                <div className="flex items-center gap-6">
                    <ProfileAvatar
                        currentAvatar={user.avatar}
                        userName={user.name}
                        size="xl"
                        editable={true}
                        onUpload={onAvatarUpload}
                        showStatus={true}
                        status="online"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">Profile Picture</h3>
                        <p className="text-sm text-slate-600 mb-3">
                            Upload a professional photo to make a great first impression
                        </p>
                        <p className="text-xs text-slate-500">
                            JPG, PNG or WebP. Max size 5MB. Recommended: 512x512px
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Information Section */}
            <FormSection icon={User} title="Personal Information">
                <div className="space-y-4">
                    {/* Name and Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={user.name}
                                onChange={(e) => onUserUpdate({ name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user.email}
                                onChange={(e) => onUserUpdate({ email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Current Role and Target Role */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="currentRole">Current Role</Label>
                            <Input
                                id="currentRole"
                                value={user.currentRole || ''}
                                onChange={(e) => onUserUpdate({ currentRole: e.target.value })}
                                placeholder="e.g., Software Engineer"
                            />
                        </div>
                        <div>
                            <Label htmlFor="targetRole">Target Role</Label>
                            <Input
                                id="targetRole"
                                value={user.targetRole || ''}
                                onChange={(e) => onUserUpdate({ targetRole: e.target.value })}
                                placeholder="e.g., Senior Software Engineer"
                            />
                        </div>
                    </div>

                    {/* Career Stage */}
                    <div>
                        <Label>Career Stage</Label>
                        <div className="mt-2">
                            <Badge className="capitalize">
                                {user.careerStage.replace('-', ' ')}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Skills Section */}
                    <div id="skills-section">
                        <Label>Skills</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                            Edit Skills
                        </Button>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
