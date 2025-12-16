import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { FormSection } from './shared/FormSection';
import type { User } from '../../types';

interface PreferencesTabProps {
    user: User;
    onUserUpdate: (updates: Partial<User>) => void;
    onSalaryUpdate: (min?: number, max?: number) => void;
}

/**
 * Preferences Tab Component
 * Handles job search preferences including locations, industries, salary, and remote work
 */
export function PreferencesTab({ user, onUserUpdate, onSalaryUpdate }: PreferencesTabProps) {
    const handleRemotePreferenceChange = (pref: string) => {
        onUserUpdate({
            preferences: {
                ...user.preferences,
                remotePreference: pref as any,
            },
        });
    };

    return (
        <div className="space-y-4">
            <FormSection icon={Briefcase} title="Job Search Preferences">
                <div className="space-y-6">
                    {/* Preferred Locations */}
                    <div>
                        <Label className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4" />
                            Preferred Locations
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {user.preferences.locations.map((location) => (
                                <Badge key={location} variant="secondary">
                                    {location}
                                </Badge>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                            Edit Locations
                        </Button>
                    </div>

                    <Separator />

                    {/* Industries of Interest */}
                    <div>
                        <Label className="mb-3 block">Industries of Interest</Label>
                        <div className="flex flex-wrap gap-2">
                            {user.preferences.industries.map((industry) => (
                                <Badge key={industry} variant="secondary">
                                    {industry}
                                </Badge>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                            Edit Industries
                        </Button>
                    </div>

                    <Separator />

                    {/* Salary Range */}
                    <div>
                        <Label className="flex items-center gap-2 mb-3">
                            <DollarSign className="w-4 h-4" />
                            Salary Range (Annual)
                        </Label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="salaryMin" className="text-sm text-slate-600">
                                    Minimum
                                </Label>
                                <Input
                                    id="salaryMin"
                                    type="number"
                                    value={user.preferences.salaryRange.min}
                                    onChange={(e) => onSalaryUpdate(Number(e.target.value), undefined)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="salaryMax" className="text-sm text-slate-600">
                                    Maximum
                                </Label>
                                <Input
                                    id="salaryMax"
                                    type="number"
                                    value={user.preferences.salaryRange.max}
                                    onChange={(e) => onSalaryUpdate(undefined, Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                            ${user.preferences.salaryRange.min.toLocaleString()} - $
                            {user.preferences.salaryRange.max.toLocaleString()}
                        </div>
                    </div>

                    <Separator />

                    {/* Remote Work Preference */}
                    <div>
                        <Label className="mb-3 block">Remote Work Preference</Label>
                        <div className="flex gap-2 flex-wrap">
                            {['remote', 'hybrid', 'onsite', 'any'].map((pref) => (
                                <Badge
                                    key={pref}
                                    variant={user.preferences.remotePreference === pref ? 'default' : 'outline'}
                                    className="cursor-pointer capitalize"
                                    onClick={() => handleRemotePreferenceChange(pref)}
                                >
                                    {pref}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
