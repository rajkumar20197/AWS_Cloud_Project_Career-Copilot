import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Lock, User, AlertCircle, CheckCircle2, Rocket } from 'lucide-react';

interface LoginFormProps {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    acceptedTerms: boolean;
    setAcceptedTerms: (value: boolean) => void;
    isLoading: boolean;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
    isLogin,
    setIsLogin,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    acceptedTerms,
    setAcceptedTerms,
    isLoading,
    error,
    onSubmit,
}: LoginFormProps) {
    return (
        <>
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
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            )}

            <motion.form
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={onSubmit}
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
            </motion.form>
        </>
    );
}
