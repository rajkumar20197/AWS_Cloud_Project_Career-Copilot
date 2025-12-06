import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

interface ServiceStatus {
  configured: boolean;
  service: string;
  status: string;
  lastTested?: string;
  error?: string;
}

export const AdminServiceConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    emailPassword: false,
    googleSecret: false
  });

  // Service status
  const [emailStatus, setEmailStatus] = useState<ServiceStatus | null>(null);
  const [calendarStatus, setCalendarStatus] = useState<ServiceStatus | null>(null);

  // Email configuration
  const [emailConfig, setEmailConfig] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    user: '',
    password: '',
    from: '"AI Career Agent Coach" <noreply@aicareeragentcoach.com>',
    replyTo: 'support@aicareeragentcoach.com'
  });

  // Google Calendar configuration
  const [calendarConfig, setCalendarConfig] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: 'http://localhost:5000/api/calendar/auth/callback'
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadServiceStatus();
  }, []);

  const loadServiceStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/services/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmailStatus(data.email);
        setCalendarStatus(data.calendar);
      }
    } catch (error) {
      console.error('Failed to load service status:', error);
    }
  };

  const handleEmailConfigSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/services/email/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(emailConfig)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email configuration saved successfully!' });
        await loadServiceStatus();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save email configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error while saving email configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarConfigSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/services/calendar/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(calendarConfig)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Calendar configuration saved successfully!' });
        await loadServiceStatus();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save calendar configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error while saving calendar configuration' });
    } finally {
      setLoading(false);
    }
  };

  const testEmailService = async () => {
    setTesting('email');
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/services/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ to: emailConfig.user })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Test email sent successfully! Check ${emailConfig.user}` });
        await loadServiceStatus();
      } else {
        setMessage({ type: 'error', text: result.error || 'Email test failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error during email test' });
    } finally {
      setTesting(null);
    }
  };

  const testCalendarService = async () => {
    setTesting('calendar');
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/services/calendar/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Calendar service test completed successfully!' });
        await loadServiceStatus();
      } else {
        setMessage({ type: 'error', text: result.error || 'Calendar test failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error during calendar test' });
    } finally {
      setTesting(null);
    }
  };

  const getStatusBadge = (status: ServiceStatus | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    if (status.configured) {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Configured
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Not Configured
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enterprise Service Configuration</h2>
          <p className="text-muted-foreground">Configure Gmail SMTP and Google Calendar integration services</p>
        </div>
        <Button onClick={loadServiceStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Gmail SMTP
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Google Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Gmail SMTP Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure Gmail SMTP for enterprise email communications (welcome messages, notifications, alerts)
                  </CardDescription>
                </div>
                {getStatusBadge(emailStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailHost">SMTP Host</Label>
                  <Input
                    id="emailHost"
                    value={emailConfig.host}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailPort">SMTP Port</Label>
                  <Input
                    id="emailPort"
                    value={emailConfig.port}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, port: e.target.value }))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailUser">Gmail Address</Label>
                <Input
                  id="emailUser"
                  type="email"
                  value={emailConfig.user}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, user: e.target.value }))}
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPassword">Gmail App Password</Label>
                <div className="relative">
                  <Input
                    id="emailPassword"
                    type={showPasswords.emailPassword ? 'text' : 'password'}
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="16-character application password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({ ...prev, emailPassword: !prev.emailPassword }))}
                  >
                    {showPasswords.emailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generate an application-specific password in your Google Account security settings (requires 2FA)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailFrom">From Address</Label>
                  <Input
                    id="emailFrom"
                    value={emailConfig.from}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, from: e.target.value }))}
                    placeholder='"AI Career Coach" <noreply@domain.com>'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailReplyTo">Reply-To Address</Label>
                  <Input
                    id="emailReplyTo"
                    value={emailConfig.replyTo}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, replyTo: e.target.value }))}
                    placeholder="support@domain.com"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleEmailConfigSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
                <Button 
                  onClick={testEmailService} 
                  variant="outline" 
                  disabled={testing === 'email' || !emailConfig.user || !emailConfig.password}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {testing === 'email' ? 'Testing...' : 'Test Email'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Google Calendar Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure Google Calendar API for automated interview scheduling and calendar management
                  </CardDescription>
                </div>
                {getStatusBadge(calendarStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleClientId">Google Client ID</Label>
                <Input
                  id="googleClientId"
                  value={calendarConfig.clientId}
                  onChange={(e) => setCalendarConfig(prev => ({ ...prev, clientId: e.target.value }))}
                  placeholder="your-client-id.apps.googleusercontent.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleClientSecret">Google Client Secret</Label>
                <div className="relative">
                  <Input
                    id="googleClientSecret"
                    type={showPasswords.googleSecret ? 'text' : 'password'}
                    value={calendarConfig.clientSecret}
                    onChange={(e) => setCalendarConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                    placeholder="Your Google Client Secret"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({ ...prev, googleSecret: !prev.googleSecret }))}
                  >
                    {showPasswords.googleSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleRedirectUri">Redirect URI</Label>
                <Input
                  id="googleRedirectUri"
                  value={calendarConfig.redirectUri}
                  onChange={(e) => setCalendarConfig(prev => ({ ...prev, redirectUri: e.target.value }))}
                  placeholder="http://localhost:5000/api/calendar/auth/callback"
                />
                <p className="text-xs text-muted-foreground">
                  Add this URI to your Google Cloud Console OAuth 2.0 configuration
                </p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Setup Instructions:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Go to Google Cloud Console</li>
                    <li>Create a new project or select existing</li>
                    <li>Enable Google Calendar API</li>
                    <li>Create OAuth 2.0 credentials</li>
                    <li>Add the redirect URI above</li>
                    <li>Copy Client ID and Secret here</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCalendarConfigSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
                <Button 
                  onClick={testCalendarService} 
                  variant="outline" 
                  disabled={testing === 'calendar' || !calendarConfig.clientId || !calendarConfig.clientSecret}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {testing === 'calendar' ? 'Testing...' : 'Test Calendar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};