import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { EnhancedCountdownTimer } from './EnhancedCountdownTimer';
import {
  User,
  Briefcase,
  Target,
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Calendar,
  Zap,
  Mail,
  TrendingUp,
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (userData: any) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [showCountdown, setShowCountdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    careerStage: '',
    graduationDate: '',
    major: '',
    currentSemester: 1,
    currentRole: '',
    targetRole: '',
    skills: [] as string[],
    locations: [] as string[],
    industries: [] as string[],
    salaryMin: 80000,
    salaryMax: 130000,
    remotePreference: 'hybrid',
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const skillOptions = [
    'JavaScript', 'React', 'Python', 'AWS', 'Node.js', 'TypeScript',
    'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST APIs'
  ];

  const locationOptions = [
    'San Francisco', 'New York', 'Seattle', 'Austin', 'Remote',
    'Boston', 'Los Angeles', 'Chicago', 'Denver'
  ];

  const industryOptions = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce',
    'Consulting', 'Education', 'Media', 'Manufacturing'
  ];

  // Validation for each step
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && 
               formData.email.trim() !== '' && 
               formData.careerStage !== '' &&
               (formData.careerStage !== 'student' || (formData.graduationDate !== '' && formData.major.trim() !== ''));
      case 2:
        return formData.targetRole.trim() !== '' && 
               formData.skills.length >= 3;
      case 3:
        return formData.locations.length > 0 && 
               formData.industries.length > 0;
      case 4:
        return formData.salaryMin > 0 && 
               formData.salaryMax > formData.salaryMin;
      default:
        return true;
    }
  };

  const handleNext = () => {
    // Special handling for students entering graduation date
    if (step === 1 && formData.careerStage === 'student' && formData.graduationDate && !showCountdown) {
      setShowCountdown(true);
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
      setShowCountdown(false);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleArrayItem = (field: 'skills' | 'locations' | 'industries', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-600">Step {step} of {totalSteps}</span>
            <span className="text-sm text-slate-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && !showCountdown && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl mb-2">Welcome! Let's get started</h2>
              <p className="text-slate-600">Tell us a bit about yourself</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label>Career Stage</Label>
                <RadioGroup
                  value={formData.careerStage}
                  onValueChange={value => setFormData({ ...formData, careerStage: value })}
                >
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="flex items-center gap-3 cursor-pointer flex-1">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <div>
                          <div>Student</div>
                          <div className="text-sm text-slate-500">Currently studying</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="graduate" id="graduate" />
                      <Label htmlFor="graduate" className="flex items-center gap-3 cursor-pointer flex-1">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <div>Recent Graduate</div>
                          <div className="text-sm text-slate-500">0-2 years experience</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label htmlFor="professional" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <div>
                          <div>Experienced Professional</div>
                          <div className="text-sm text-slate-500">2+ years experience</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {formData.careerStage === 'student' && (
                <>
                  <div>
                    <Label htmlFor="major">Major / Field of Study</Label>
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={e => setFormData({ ...formData, major: e.target.value })}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="semester">Current Semester</Label>
                    <select
                      id="semester"
                      value={formData.currentSemester}
                      onChange={e => setFormData({ ...formData, currentSemester: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="graduationDate">Expected Graduation Date</Label>
                    <Input
                      id="graduationDate"
                      type="date"
                      value={formData.graduationDate}
                      onChange={e => setFormData({ ...formData, graduationDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Countdown Timer Screen for Students */}
        <AnimatePresence>
          {step === 1 && showCountdown && formData.careerStage === 'student' && (
            <EnhancedCountdownTimer 
              graduationDate={formData.graduationDate || ''}
              onContinue={() => {
                setShowCountdown(false);
                handleNext();
              }}
              onAddToCalendar={() => {
                // Create calendar event for graduation
                const graduationEvent = {
                  title: 'Graduation Day 🎓',
                  date: formData.graduationDate,
                  description: 'My graduation day - Career Copilot journey begins!',
                  location: formData.university || 'University'
                };
                
                // Create Google Calendar URL
                const startDate = new Date(formData.graduationDate || '').toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(graduationEvent.title)}&dates=${startDate}/${startDate}&details=${encodeURIComponent(graduationEvent.description)}&location=${encodeURIComponent(graduationEvent.location)}`;
                
                // Open in new tab
                window.open(calendarUrl, '_blank');
              }}
            />
          )}
        </AnimatePresence>

        {/* Step 2: Career Goals */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl mb-2">Your Career Goals</h2>
              <p className="text-slate-600">Help us understand what you're looking for</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentRole">Current or Most Recent Role (optional)</Label>
                <Input
                  id="currentRole"
                  value={formData.currentRole}
                  onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                  placeholder="e.g., Junior Software Developer"
                />
              </div>

              <div>
                <Label htmlFor="targetRole">Target Role</Label>
                <Input
                  id="targetRole"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <Label>Select Your Skills (choose at least 3)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {skillOptions.map(skill => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={() => toggleArrayItem('skills', skill)}
                      />
                      <Label htmlFor={`skill-${skill}`} className="cursor-pointer">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {formData.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl mb-2">Job Preferences</h2>
              <p className="text-slate-600">Tell us about your ideal job</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Preferred Locations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {locationOptions.map(location => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`loc-${location}`}
                        checked={formData.locations.includes(location)}
                        onCheckedChange={() => toggleArrayItem('locations', location)}
                      />
                      <Label htmlFor={`loc-${location}`} className="cursor-pointer">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Industries of Interest</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {industryOptions.map(industry => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ind-${industry}`}
                        checked={formData.industries.includes(industry)}
                        onCheckedChange={() => toggleArrayItem('industries', industry)}
                      />
                      <Label htmlFor={`ind-${industry}`} className="cursor-pointer">
                        {industry}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Remote Work Preference</Label>
                <RadioGroup
                  value={formData.remotePreference}
                  onValueChange={value => setFormData({ ...formData, remotePreference: value })}
                >
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['remote', 'hybrid', 'onsite', 'any'].map(pref => (
                      <div key={pref} className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value={pref} id={`pref-${pref}`} />
                        <Label htmlFor={`pref-${pref}`} className="cursor-pointer capitalize">
                          {pref}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Salary Expectations */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl mb-2">Salary Expectations</h2>
              <p className="text-slate-600">Set your expected salary range</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary (Annual)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span>$</span>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={e => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                    step={5000}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="salaryMax">Maximum Salary (Annual)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span>$</span>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={e => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                    step={5000}
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm">Your expected salary range:</div>
                <div className="text-2xl text-blue-600 mt-1">
                  ${formData.salaryMin.toLocaleString()} - ${formData.salaryMax.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <h3 className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  All Set!
                </h3>
                <p className="text-sm text-slate-600">
                  We'll use this information to find the best job matches for you using AI-powered analysis.
                  You can update these preferences anytime in your settings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Message */}
        {!isStepValid() && !showCountdown && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              {step === 1 && '⚠️ Please fill in all required fields (name, email, career stage)'}
              {step === 2 && '⚠️ Please enter your target role and select at least 3 skills'}
              {step === 3 && '⚠️ Please select at least one location and one industry'}
              {step === 4 && '⚠️ Please set a valid salary range'}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!isStepValid() && !showCountdown}
            className={!isStepValid() && !showCountdown ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {step === totalSteps ? 'Complete Setup' : showCountdown ? 'Continue to Career Goals' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
}