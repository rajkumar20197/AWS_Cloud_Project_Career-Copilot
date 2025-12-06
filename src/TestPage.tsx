import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { CheckCircle, X, Play, Server, Database, Mail, Calendar, CreditCard, Shield, User } from 'lucide-react';

const TestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      id: 'health',
      name: 'Backend Health Check',
      description: 'Test if backend server is running',
      icon: Server,
      test: async () => {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      }
    },
    {
      id: 'admin-login',
      name: 'Admin Authentication',
      description: 'Test admin login functionality',
      icon: Shield,
      test: async () => {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@gmail.com', password: 'password123' })
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      }
    },
    {
      id: 'ai-analysis',
      name: 'AI Resume Analysis',
      description: 'Test AI-powered resume analysis',
      icon: Database,
      test: async () => {
        const response = await fetch('/api/ai/analyze-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            resumeText: 'John Doe\nSoftware Engineer\n5 years experience in React and Node.js\nEducation: Computer Science Degree' 
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      }
    },
    {
      id: 'email-service',
      name: 'Email Service Status',
      description: 'Check Gmail SMTP configuration',
      icon: Mail,
      test: async () => {
        const response = await fetch('/api/email/status');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      }
    },
    {
      id: 'calendar-service',
      name: 'Google Calendar Status',
      description: 'Check Google Calendar integration',
      icon: Calendar,
      test: async () => {
        const response = await fetch('/api/calendar/status');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      }
    },
    {
      id: 'user-registration',
      name: 'User Registration System',
      description: 'Test user registration endpoint',
      icon: User,
      test: async () => {
        // Test with a dummy user to check if endpoint responds correctly
        const testUser = {
          firstName: 'Test',
          lastName: 'User',
          email: `test${Date.now()}@example.com`,
          password: 'TestPassword123',
          jobTitle: 'Software Engineer',
          experience: 'mid',
          goals: ['Find a new job']
        };
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testUser)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { message: 'Registration endpoint working', status: 'success' };
      }
    },
    {
      id: 'deployment-readiness',
      name: 'Deployment Readiness',
      description: 'Check if all systems are ready for production',
      icon: CheckCircle,
      test: async () => {
        const checks = [];
        
        // Check backend health
        try {
          const healthResponse = await fetch('/api/health');
          const healthData = await healthResponse.json();
          checks.push({ service: 'Backend', status: healthData.status === 'healthy' ? 'Ready' : 'Not Ready' });
        } catch (e) {
          checks.push({ service: 'Backend', status: 'Failed' });
        }
        
        // Check admin system
        try {
          const adminResponse = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'password123' })
          });
          const adminData = await adminResponse.json();
          checks.push({ service: 'Admin Auth', status: adminData.success ? 'Ready' : 'Not Ready' });
        } catch (e) {
          checks.push({ service: 'Admin Auth', status: 'Failed' });
        }
        
        return {
          message: 'Deployment readiness check completed',
          checks,
          overallStatus: checks.every(c => c.status === 'Ready') ? 'READY FOR DEPLOYMENT' : 'NEEDS ATTENTION'
        };
      }
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id, test.test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getTestStatus = (testId: string) => {
    if (loading[testId]) return 'loading';
    if (!testResults[testId]) return 'pending';
    return testResults[testId].success ? 'success' : 'error';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <X className="w-5 h-5 text-red-600" />;
      case 'loading': return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default: return <Play className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">✅ Passed</Badge>;
      case 'error': return <Badge variant="destructive">❌ Failed</Badge>;
      case 'loading': return <Badge variant="outline">⏳ Running</Badge>;
      default: return <Badge variant="outline">⏸️ Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 AI Career Coach - System Tests
          </h1>
          <p className="text-gray-600">
            Verify all systems are working correctly before deployment
          </p>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Run individual tests or all tests at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={runAllTests} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setTestResults({});
                  setLoading({});
                }}
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => {
            const status = getTestStatus(test.id);
            const result = testResults[test.id];
            
            return (
              <Card key={test.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <test.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <CardDescription>{test.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runTest(test.id, test.test)}
                      disabled={loading[test.id]}
                    >
                      {loading[test.id] ? 'Running...' : 'Run Test'}
                    </Button>
                  </div>
                  
                  {result && (
                    <div className="mt-3">
                      {result.success ? (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Test Passed!</strong>
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm font-medium">View Response</summary>
                              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            </details>
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert variant="destructive">
                          <X className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Test Failed:</strong> {result.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>System Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter(r => r?.success).length}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter(r => r && !r.success).length}
                </div>
                <div className="text-sm text-gray-600">Tests Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(loading).filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-600">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {tests.length - Object.keys(testResults).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" asChild>
                <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
                  Frontend App
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer">
                  Backend API
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="http://localhost:3000/admin" target="_blank" rel="noopener noreferrer">
                  Admin Dashboard
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer">
                  Health Check
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;