import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { User, Mail, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AuthBypassProps {
  onComplete: (userData: any) => void;
}

export function AuthBypass({ onComplete }: AuthBypassProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleBypass = () => {
    if (!name || !email) {
      toast.error('Please enter your name and email');
      return;
    }

    const userData = {
      name,
      email,
      careerStage: 'professional',
      targetRole: 'Software Engineer',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: '2-3 years',
      locations: ['San Francisco'],
      salaryMin: 80000,
      salaryMax: 120000,
    };

    toast.success('🚀 Authentication bypassed - Welcome to Career Copilot!');
    onComplete(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Quick Access</h1>
          <p className="text-slate-600">Skip authentication and test the platform</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleBypass}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Access Platform
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            This bypasses authentication for testing purposes
          </p>
        </div>
      </Card>
    </div>
  );
}