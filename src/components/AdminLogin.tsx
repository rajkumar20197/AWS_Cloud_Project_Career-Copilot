import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { adminService } from '../services/adminService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    mfaCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresMFA, setRequiresMFA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!requiresMFA) {
        const result = await adminService.login(credentials.email, credentials.password);
        if (result.requiresMFA) {
          setRequiresMFA(true);
        } else {
          onLoginSuccess();
        }
      } else {
        await adminService.verifyMFA(credentials.mfaCode);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            {requiresMFA ? 'Enter your multi-factor authentication code' : 'Sign in to access the administrative dashboard'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!requiresMFA ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Administrator Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={credentials.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="mfaCode">MFA Code</Label>
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="000000"
                  value={credentials.mfaCode}
                  onChange={(e) => handleInputChange('mfaCode', e.target.value)}
                  maxLength={6}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {requiresMFA ? 'Verifying...' : 'Signing in...'}
                </div>
              ) : (
                requiresMFA ? 'Verify Code' : 'Sign In'
              )}
            </Button>

            {requiresMFA && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setRequiresMFA(false)}
                disabled={loading}
              >
                Back to Login
              </Button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Secure administrative access with enterprise-grade authentication
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};