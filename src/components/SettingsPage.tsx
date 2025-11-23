import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { AvatarUpload } from './AvatarUpload';
import {
  User,
  Bell,
  Key,
  Briefcase,
  MapPin,
  DollarSign,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { mockUser } from '../services/mockData';
import type { User as UserType } from '../types';
import { toast } from 'sonner';

export function SettingsPage() {
  const [user, setUser] = useState<UserType>(mockUser);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Settings & Preferences</h1>
        <p className="text-slate-600">Manage your account and customize your experience</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          {/* Avatar Upload */}
          <AvatarUpload
            currentAvatar={user.avatar}
            userName={user.name}
            onUpload={async (file) => {
              // Simulate upload
              await new Promise(resolve => setTimeout(resolve, 1500));
              toast.success('Profile picture updated!');
              // In production: upload to S3 and update user profile
            }}
          />
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl">Personal Information</h2>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={e => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentRole">Current Role</Label>
                  <Input
                    id="currentRole"
                    value={user.currentRole || ''}
                    onChange={e => setUser({ ...user, currentRole: e.target.value })}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Input
                    id="targetRole"
                    value={user.targetRole || ''}
                    onChange={e => setUser({ ...user, targetRole: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>

              <div>
                <Label>Career Stage</Label>
                <div className="mt-2">
                  <Badge className="capitalize">{user.careerStage.replace('-', ' ')}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.skills.map(skill => (
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
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl">Job Search Preferences</h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" />
                  Preferred Locations
                </Label>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.locations.map(location => (
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

              <div>
                <Label className="mb-3 block">Industries of Interest</Label>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.industries.map(industry => (
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
                      onChange={e =>
                        setUser({
                          ...user,
                          preferences: {
                            ...user.preferences,
                            salaryRange: {
                              ...user.preferences.salaryRange,
                              min: Number(e.target.value),
                            },
                          },
                        })
                      }
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
                      onChange={e =>
                        setUser({
                          ...user,
                          preferences: {
                            ...user.preferences,
                            salaryRange: {
                              ...user.preferences.salaryRange,
                              max: Number(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  ${user.preferences.salaryRange.min.toLocaleString()} - $
                  {user.preferences.salaryRange.max.toLocaleString()}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="mb-3 block">Remote Work Preference</Label>
                <div className="flex gap-2">
                  {['remote', 'hybrid', 'onsite', 'any'].map(pref => (
                    <Badge
                      key={pref}
                      variant={user.preferences.remotePreference === pref ? 'default' : 'outline'}
                      className="cursor-pointer capitalize"
                      onClick={() =>
                        setUser({
                          ...user,
                          preferences: {
                            ...user.preferences,
                            remotePreference: pref as any,
                          },
                        })
                      }
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl">Notification Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1">Job Alerts</h4>
                  <p className="text-sm text-slate-600">
                    Receive notifications when new jobs match your preferences
                  </p>
                </div>
                <Switch
                  checked={user.preferences.jobAlerts}
                  onCheckedChange={checked =>
                    setUser({
                      ...user,
                      preferences: { ...user.preferences, jobAlerts: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1">Email Notifications</h4>
                  <p className="text-sm text-slate-600">
                    Get email updates about applications, interviews, and more
                  </p>
                </div>
                <Switch
                  checked={user.preferences.emailNotifications}
                  onCheckedChange={checked =>
                    setUser({
                      ...user,
                      preferences: { ...user.preferences, emailNotifications: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1">Interview Reminders</h4>
                  <p className="text-sm text-slate-600">
                    Automatic reminders before scheduled interviews
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1">Weekly Progress Reports</h4>
                  <p className="text-sm text-slate-600">
                    Get a weekly summary of your job search activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1">Market Intelligence Updates</h4>
                  <p className="text-sm text-slate-600">
                    Receive insights about salary trends and skill demand
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-5 h-5 text-green-600" />
              <h2 className="text-xl">Connected Services</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="mb-1">Gmail</h4>
                    <p className="text-sm text-slate-600">Connected to {user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h4 className="mb-1">Google Calendar</h4>
                    <p className="text-sm text-slate-600">Sync interviews and deadlines</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">☁️</span>
                  </div>
                  <div>
                    <h4 className="mb-1">AWS Bedrock</h4>
                    <p className="text-sm text-slate-600">AI-powered career guidance</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💼</span>
                  </div>
                  <div>
                    <h4 className="mb-1">LinkedIn</h4>
                    <p className="text-sm text-slate-600">Import profile and connections</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-50">
            <h3 className="mb-4">API Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bedrock-key">AWS Bedrock API Key</Label>
                <Input
                  id="bedrock-key"
                  type="password"
                  placeholder="YOUR_BEDROCK_API_KEY_HERE"
                  className="bg-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Replace with your actual AWS Bedrock credentials
                </p>
              </div>
              <div>
                <Label htmlFor="gmail-api-key">Gmail API Key</Label>
                <Input
                  id="gmail-api-key"
                  type="password"
                  placeholder="YOUR_GMAIL_API_KEY_HERE"
                  className="bg-white"
                />
                <p className="text-xs text-slate-500 mt-1">OAuth 2.0 credentials required</p>
              </div>
            </div>
          </Card>
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
