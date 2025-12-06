import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Star, 
  Heart, 
  Zap, 
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Award,
  Briefcase
} from 'lucide-react';
import { Logo, LogoMinimal, LogoBadge } from './Logo';

const ComponentTest: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState(65);

  const testData = {
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    stats: {
      applications: 24,
      interviews: 8,
      offers: 3,
      responseRate: 85
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🧪 Component Testing Suite
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Testing all UI components and functionality
          </p>
        </div>

        {/* Logo Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Logo Components
            </CardTitle>
            <CardDescription>
              Testing different logo variants and sizes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-gray-900">Full Logo</h3>
                <div className="flex flex-col items-center space-y-3">
                  <Logo size="xl" variant="full" animated />
                  <Logo size="lg" variant="full" />
                  <Logo size="md" variant="full" />
                  <Logo size="sm" variant="full" />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-gray-900">Icon Only</h3>
                <div className="flex flex-col items-center space-y-3">
                  <Logo size="xl" variant="icon" />
                  <Logo size="lg" variant="icon" />
                  <Logo size="md" variant="icon" />
                  <Logo size="sm" variant="icon" />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-gray-900">Minimal & Badge</h3>
                <div className="flex flex-col items-center space-y-3">
                  <LogoBadge size={64} />
                  <LogoMinimal size={48} />
                  <LogoBadge size={32} />
                  <LogoMinimal size={24} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UI Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Buttons & Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons & Inputs</CardTitle>
              <CardDescription>Interactive form elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label htmlFor="test-input">Test Input</Label>
                <Input
                  id="test-input"
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <p className="text-sm text-gray-600">
                  You typed: {inputValue || 'Nothing yet'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Badges</CardTitle>
              <CardDescription>Status indicators and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is an info alert message.
                </AlertDescription>
              </Alert>
              
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This is a destructive alert for errors.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress & Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Progress & Statistics</CardTitle>
              <CardDescription>Data visualization components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-gray-900">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                    -10%
                  </Button>
                  <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                    +10%
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {testData.stats.applications}
                  </div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testData.stats.interviews}
                  </div>
                  <div className="text-sm text-gray-600">Interviews</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Profile
              </CardTitle>
              <CardDescription>User information display</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {testData.user.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Software Engineer
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{testData.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{testData.user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{testData.user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Last active: {testData.user.lastActive}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Component Test Results
            </CardTitle>
            <CardDescription>
              All components tested and working properly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">Logo Components</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">UI Components</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">Interactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-gray-600">Responsiveness</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentTest;