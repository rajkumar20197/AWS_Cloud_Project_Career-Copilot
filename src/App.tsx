import { useState, useEffect } from 'react';
import './config/cognito'; // Initialize AWS Cognito
import { EnhancedLandingPage } from './components/EnhancedLandingPage';
import { LoginPage } from './components/LoginPage';
import { Onboarding } from './components/Onboarding';
import { AuthGuard } from './components/AuthGuard';
import { InteractiveDashboard } from './components/InteractiveDashboard';
import { JobSearchDashboard } from './components/JobSearchDashboard';
import { JobSwiper } from './components/JobSwiper';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ResumeOptimizer } from './components/ResumeOptimizer';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { AIMockInterview } from './components/AIMockInterview';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { OfferComparison } from './components/OfferComparison';
import { MarketIntelligence } from './components/MarketIntelligence';
import { GmailIntegration } from './components/GmailIntegration';
import { SettingsPage } from './components/SettingsPage';
import MorningDashboard from './components/MorningDashboard';
import SchedulingDashboard from './components/SchedulingDashboard';
import AvailabilitySettings from './components/AvailabilitySettings';
import ApplicationTrackingDashboard from './components/ApplicationTrackingDashboard';
import { Logo } from './components/Logo';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/sonner';
import {
  Menu,
  X,
  Home,
  Search,
  FileText,
  TrendingUp,
  Mail,
  Settings,
  LogOut,
  Bell,
  User,
  Heart,
  Briefcase,
  Mic,
  Target,
  Scale,
  Sparkles,
  Calendar,
  Bot,
  Clock,
} from 'lucide-react';
import type { NavigationPage } from './types';
import { toast } from 'sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('landing');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notificationCount] = useState(3);
  const [userData, setUserData] = useState<any>(null);

  // Check for existing Cognito session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { getCurrentUser } = await import('aws-amplify/auth');
        const user = await getCurrentUser();
        
        if (user) {
          // User is already signed in
          const userData = {
            name: user.signInDetails?.loginId || 'User',
            email: user.signInDetails?.loginId || '',
            userId: user.userId,
          };
          
          setUserData(userData);
          setIsLoggedIn(true);
          setIsOnboarded(true);
          setCurrentPage('dashboard');
          console.log('✅ Existing Cognito session found, auto-login successful');
        }
      } catch (error) {
        console.log('No existing session - showing landing page');
      }
    };
    
    checkExistingSession();
  }, []);

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleLogin = (userData?: any) => {
    setIsLoggedIn(true);
    if (userData) {
      setUserData(userData);
      // If user has data, skip onboarding and go to dashboard
      setIsOnboarded(true);
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('onboarding');
    }
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleLogoClick = () => {
    if (isOnboarded) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('landing');
    }
  };

  const handleOnboardingComplete = (userData: any) => {
    console.log('User data:', userData);
    setIsOnboarded(true);
    setCurrentPage('dashboard');
  };

  const navigationItems = [
    { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: Home, badge: null },
    { id: 'morning-dashboard' as NavigationPage, label: 'Morning Brief', icon: Clock, badge: '3 today' },
    { id: 'scheduling-dashboard' as NavigationPage, label: 'AI Scheduler', icon: Bot, badge: 'Active' },
    { id: 'availability-settings' as NavigationPage, label: 'Availability', icon: Calendar, badge: null },
    { id: 'application-tracking' as NavigationPage, label: 'App Tracking', icon: TrendingUp, badge: '12 active' },
    { id: 'job-search' as NavigationPage, label: 'Job Search', icon: Search, badge: '6 new' },
    { id: 'job-swiper' as NavigationPage, label: 'Job Swiper', icon: Heart, badge: '12 new' },
    { id: 'application-tracker' as NavigationPage, label: 'Applications', icon: Briefcase, badge: null },
    { id: 'resume' as NavigationPage, label: 'Resume Optimizer', icon: FileText, badge: null },
    { id: 'cover-letter' as NavigationPage, label: 'Cover Letter', icon: Sparkles, badge: null },
    { id: 'mock-interview' as NavigationPage, label: 'Mock Interview', icon: Mic, badge: null },
    { id: 'skill-gap' as NavigationPage, label: 'Skill Gap', icon: Target, badge: null },
    { id: 'offer-comparison' as NavigationPage, label: 'Offers', icon: Scale, badge: null },
    { id: 'market-intelligence' as NavigationPage, label: 'Market Intel', icon: TrendingUp, badge: null },
    { id: 'gmail' as NavigationPage, label: 'Gmail & Calendar', icon: Mail, badge: notificationCount },
    { id: 'settings' as NavigationPage, label: 'Settings', icon: Settings, badge: null },
  ];

  const renderPage = () => {
    if (currentPage === 'landing') {
      return <EnhancedLandingPage onGetStarted={handleGetStarted} />;
    }

    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} onBackToLanding={handleBackToLanding} />;
    }

    if (currentPage === 'onboarding') {
      return (
        <AuthGuard onAuthRequired={() => setCurrentPage('login')}>
          <Onboarding onComplete={handleOnboardingComplete} />
        </AuthGuard>
      );
    }

    // Dashboard pages with sidebar - protected by authentication
    return (
      <AuthGuard onAuthRequired={() => setCurrentPage('login')}>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40 ${
            isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 flex items-center justify-between">
              {isSidebarOpen ? (
                <Logo size="sm" variant="full" onClick={handleLogoClick} />
              ) : (
                <Logo size="sm" variant="icon" onClick={handleLogoClick} />
              )}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        {item.badge && (
                          <Badge
                            className={`text-xs ${
                              isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </nav>

            <Separator />

            {/* User Profile */}
            <div className="p-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer ${
                isSidebarOpen ? '' : 'justify-center'
              }`}>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{userData?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{userData?.email || 'Graduate'}</p>
                  </div>
                )}
              </div>
              {isSidebarOpen && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const { signOut } = await import('aws-amplify/auth');
                      await signOut();
                      setIsLoggedIn(false);
                      setIsOnboarded(false);
                      setUserData(null);
                      setCurrentPage('landing');
                      toast.success('Logged out successfully');
                    } catch (error) {
                      console.error('Logout error:', error);
                      toast.error('Logout failed');
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl">AI Career Agent Platform</h1>
                  <p className="text-sm text-slate-600">
                    Authenticated • Powered by AWS Bedrock Claude 3.5 Haiku
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-slate-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            {currentPage === 'dashboard' && <InteractiveDashboard onNavigate={setCurrentPage} />}
            {currentPage === 'morning-dashboard' && <MorningDashboard />}
            {currentPage === 'scheduling-dashboard' && <SchedulingDashboard />}
            {currentPage === 'availability-settings' && <AvailabilitySettings />}
            {currentPage === 'application-tracking' && <ApplicationTrackingDashboard />}
            {currentPage === 'job-search' && <JobSearchDashboard />}
            {currentPage === 'job-swiper' && <JobSwiper />}
            {currentPage === 'application-tracker' && <ApplicationTracker />}
            {currentPage === 'resume' && <ResumeOptimizer />}
            {currentPage === 'cover-letter' && <CoverLetterGenerator />}
            {currentPage === 'mock-interview' && <AIMockInterview />}
            {currentPage === 'skill-gap' && <SkillGapAnalyzer />}
            {currentPage === 'offer-comparison' && <OfferComparison />}
            {currentPage === 'market-intelligence' && <MarketIntelligence />}
            {currentPage === 'gmail' && <GmailIntegration />}
            {currentPage === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>
      </AuthGuard>
    );
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
      <Toaster position="top-right" />
    </div>
  );
}

// Dashboard Home Component
function DashboardHome({ onNavigate }: { onNavigate: (page: NavigationPage) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome Back! 👋</h1>
        <p className="text-slate-600">Here's your career progress overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">AI Job Matches</p>
          <p className="text-3xl mt-2">6</p>
          <p className="text-sm mt-1 opacity-75">New this week</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Applications</p>
          <p className="text-3xl mt-2">12</p>
          <p className="text-sm mt-1 opacity-75">2 interviews scheduled</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Resume Score</p>
          <p className="text-3xl mt-2">82</p>
          <p className="text-sm mt-1 opacity-75">Good! Can improve</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Profile Views</p>
          <p className="text-3xl mt-2">45</p>
          <p className="text-sm mt-1 opacity-75">+12% this week</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-500 cursor-pointer transition-colors"
          onClick={() => onNavigate('job-search')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700">6 new matches</Badge>
          </div>
          <h3 className="text-xl mb-2">Browse AI Job Matches</h3>
          <p className="text-slate-600 mb-4">
            Discover 6 new jobs with 90+ compatibility scores based on your profile
          </p>
          <Button className="w-full">View Job Matches →</Button>
        </div>

        <div
          className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-purple-500 cursor-pointer transition-colors"
          onClick={() => onNavigate('resume')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <Badge className="bg-orange-100 text-orange-700">Improve</Badge>
          </div>
          <h3 className="text-xl mb-2">Optimize Your Resume</h3>
          <p className="text-slate-600 mb-4">
            AI analysis suggests 5 improvements to boost your ATS score to 90+
          </p>
          <Button className="w-full">Optimize Now →</Button>
        </div>

        <div
          className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-green-500 cursor-pointer transition-colors"
          onClick={() => onNavigate('market-intelligence')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700">+8.5% avg</Badge>
          </div>
          <h3 className="text-xl mb-2">Market Intelligence</h3>
          <p className="text-slate-600 mb-4">
            Software Engineer salaries in SF up 8.5% • React demand +15.2%
          </p>
          <Button className="w-full">View Insights →</Button>
        </div>

        <div
          className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-orange-500 cursor-pointer transition-colors"
          onClick={() => onNavigate('morning-dashboard' as NavigationPage)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <Badge className="bg-orange-100 text-orange-700">3 today</Badge>
          </div>
          <h3 className="text-xl mb-2">Morning Dashboard</h3>
          <p className="text-slate-600 mb-4">
            "Wake up → Check Calendar → See Everything" - Your daily career briefing
          </p>
          <Button className="w-full">View Today's Schedule →</Button>
        </div>
      </div>
    </div>
  );
}