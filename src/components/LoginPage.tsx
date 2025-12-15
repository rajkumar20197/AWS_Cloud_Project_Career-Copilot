import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Logo } from './Logo';
import { AuthService } from '../services/authService';
import { toast } from 'sonner';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  Zap,
  Brain,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Rocket,
  Target,
  User,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData?: any) => void;
  onBackToLanding?: () => void;
}

export function LoginPage({ onLogin, onBackToLanding }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Sign in
        const result = await AuthService.signIn({ email, password });
        if (result.isSignedIn) {
          // Get user attributes after successful login
          try {
            const { getCurrentUser } = await import('aws-amplify/auth');
            const user = await getCurrentUser();
            const userData = {
              name: user.signInDetails?.loginId || name || 'User',
              email: email,
              userId: user.userId,
            };
            toast.success(`Welcome back, ${userData.name}!`);
            onLogin(userData);
          } catch (error) {
            console.log('Could not get user details, proceeding with basic info');
            onLogin({ name: name || 'User', email: email });
          }
        }
      } else {
        // Sign up
        const result = await AuthService.signUp({ email, password, name });
        if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          setNeedsConfirmation(true);
          toast.success('Verification code sent to your email!');
        } else if (result.isSignUpComplete) {
          toast.success('Account created! Please sign in.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await AuthService.confirmSignUp({ email, code: confirmationCode });
      toast.success('Email verified! Please sign in.');
      setNeedsConfirmation(false);
      setIsLogin(true);
      setConfirmationCode('');
    } catch (err: any) {
      console.error('Confirmation error:', err);
      setError(err.message || 'Verification failed');
      toast.error(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await AuthService.resendConfirmationCode(email);
      toast.success('Verification code resent!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code');
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: '0-100 compatibility scores using AWS Bedrock',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Calendar,
      title: 'Auto-Scheduling',
      description: 'Gmail scanning + automatic interview booking',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Real-time salary trends and career insights',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Zap,
      title: '24/7 Automation',
      description: 'Set and forget - AI works while you study',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const steps = [
    { icon: Target, text: 'Set graduation date' },
    { icon: Sparkles, text: 'AI scans job portals' },
    { icon: Brain, text: 'Smart job matching' },
    { icon: CheckCircle2, text: 'Land dream job!' },
  ];

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Features & Branding */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="lg" variant="full" className="mb-8" onClick={onBackToLanding} />

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-6xl text-white leading-tight">
                From Graduation
                <br />
                to Dream Job
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {' '}Automatically
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-md">
                AI-powered career agent that works 24/7 using AWS Bedrock.
                Set your date, let AI handle everything.
              </p>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-6">
                How It Works
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all group-hover:scale-110">
                      <step.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
                        {index + 1}
                      </span>
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        {step.text}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { label: 'AI Accuracy', value: '92%' },
              { label: 'Time Saved', value: '10hrs/wk' },
              { label: 'Job Matches', value: '100+' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
              >
                <div className="text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Glassmorphic Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Logo for Mobile */}
              <div className="lg:hidden mb-8 flex justify-center">
                <Logo size="md" variant="full" onClick={onBackToLanding} />
              </div>

              {/* Toggle Login/Signup */}
              <div className="flex gap-2 mb-8 bg-white/5 rounded-2xl p-1.5">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all font-medium ${isLogin
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="relative z-10">Login</span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all font-medium ${!isLogin
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="relative z-10">Sign Up</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {needsConfirmation ? (
                  <motion.form
                    key="confirmation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleConfirmSignUp}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-xl text-white font-semibold">Verify Your Email</h3>
                      <p className="text-sm text-slate-400">
                        We sent a verification code to <span className="text-blue-400">{email}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">
                        Verification Code
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        required
                        maxLength={6}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 h-12 rounded-xl text-center text-2xl tracking-widest"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
                    >
                      {isLoading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="w-full text-sm text-blue-400 hover:text-blue-300"
                    >
                      Didn't receive code? Resend
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key={isLogin ? 'login' : 'signup'}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {!isLogin && (
                      <div>
                        <label className="text-sm text-slate-300 mb-2 block">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 h-12 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 h-12 rounded-xl"
                        />
                      </div>
                      {!isLogin && (
                        <div className="mt-3 space-y-2 bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-xs font-medium text-slate-300 mb-2">Password must include:</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${password.length >= 8 ? 'text-green-400' : 'text-slate-500'}`} />
                              <span className={password.length >= 8 ? 'text-green-400' : 'text-slate-400'}>
                                At least 8 characters
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-slate-500'}`} />
                              <span className={/[A-Z]/.test(password) ? 'text-green-400' : 'text-slate-400'}>
                                One uppercase letter (A-Z)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${/[a-z]/.test(password) ? 'text-green-400' : 'text-slate-500'}`} />
                              <span className={/[a-z]/.test(password) ? 'text-green-400' : 'text-slate-400'}>
                                One lowercase letter (a-z)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${/[0-9]/.test(password) ? 'text-green-400' : 'text-slate-500'}`} />
                              <span className={/[0-9]/.test(password) ? 'text-green-400' : 'text-slate-400'}>
                                One number (0-9)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : 'text-slate-500'}`} />
                              <span className={/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : 'text-slate-400'}>
                                One special character (!@#$%^&*)
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-blue-400">
                              Example: MyPass123!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isLogin && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <label className="flex items-start gap-3 text-sm text-slate-300 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            required
                            className="mt-0.5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="group-hover:text-white transition-colors">
                            I agree to the{' '}
                            <a
                              href="/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Terms and Conditions
                            </a>
                            {' '}and{' '}
                            <a
                              href="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    )}

                    {isLogin && (
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input type="checkbox" className="rounded border-white/20" />
                          Remember me
                        </label>
                        <a href="#" className="text-blue-400 hover:text-blue-300">
                          Forgot password?
                        </a>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || (!isLogin && !acceptedTerms)}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-slate-400">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-slate-400">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await AuthService.signInWithGitHub();
                          } catch (err: any) {
                            toast.error(err.message || 'GitHub login failed');
                          }
                        }}
                        className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:scale-105"
                      >
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await AuthService.signInWithGoogle();
                          } catch (err: any) {
                            toast.error(err.message || 'Google login failed');
                          }
                        }}
                        className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:scale-105"
                      >
                        <Chrome className="w-5 h-5 mr-2" />
                        Google
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Features Preview */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider">
                  Platform Features
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {features.slice(0, 4).map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all hover:scale-105 group cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xs text-slate-300 group-hover:text-white transition-colors">
                        {feature.title}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>AWS Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
              </div>

              {/* Copyright Notice */}
              <div className="text-xs text-slate-500 border-t border-white/10 pt-3">
                © 2025 AI Career Agent Coach • MIT License • All rights reserved
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
