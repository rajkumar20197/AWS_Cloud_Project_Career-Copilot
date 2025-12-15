import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, Mail, User, Lock, Briefcase } from 'lucide-react';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  jobTitle: string;
  experience: string;
  goals: string[];
}

const UserRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    experience: 'entry',
    goals: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const careerGoals = [
    'Find a new job',
    'Get promoted',
    'Negotiate salary',
    'Switch careers',
    'Improve resume',
    'Interview preparation',
    'Networking',
    'Skill development'
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-7 years)' },
    { value: 'senior', label: 'Senior Level (8-15 years)' },
    { value: 'executive', label: 'Executive (15+ years)' }
  ];

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const validateStep3 = () => {
    if (!formData.jobTitle.trim()) return 'Job title is required';
    if (formData.goals.length === 0) return 'Please select at least one career goal';
    return null;
  };

  const handleNext = () => {
    let validationError = null;

    if (step === 1) validationError = validateStep1();
    if (step === 2) validationError = validateStep2();
    if (step === 3) validationError = validateStep3();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Send welcome email
        await fetch('/api/auth/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email, firstName: formData.firstName }),
        });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Welcome Aboard!</CardTitle>
          <CardDescription>
            Your account has been created successfully. Check your email for next steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              We've sent a welcome email to <strong>{formData.email}</strong> with your login details and getting started guide.
            </AlertDescription>
          </Alert>
          <Button
            className="w-full"
            onClick={() => window.location.href = '/login'}
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Join AI Career Agent Coach</CardTitle>
        <CardDescription className="text-center">
          Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Security' : 'Career Profile'}
        </CardDescription>
        <div className="flex space-x-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
          </div>
        )}

        {/* Step 2: Security */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Repeat your password"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                  One number
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Career Profile */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Current Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="Software Engineer, Marketing Manager, etc."
              />
            </div>

            <div>
              <Label>Experience Level</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {experienceLevels.map((level) => (
                  <label key={level.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="experience"
                      value={level.value}
                      checked={formData.experience === level.value}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Career Goals (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {careerGoals.map((goal) => (
                  <Badge
                    key={goal}
                    variant={formData.goals.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer justify-center py-2"
                    onClick={() => handleGoalToggle(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Processing...' : step === 3 ? 'Create Account' : 'Next'}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in here
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRegistration;