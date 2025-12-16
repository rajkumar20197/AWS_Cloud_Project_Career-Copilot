/**
 * AI Career Agent Platform - Login Page Component
 * Copyright (c) 2025 AI Career Agent Coach
 * 
 * This file is part of the AI Career Agent Platform project.
 * Licensed under the MIT License - see LICENSE file for details.
 * 
 * @author AI Career Agent Coach
 * @created 2025
 */

import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth';
import { LoginBackground } from './login/LoginBackground';
import { LoginFeatures } from './login/LoginFeatures';
import { LoginForm } from './login/LoginForm';
import { ConfirmationForm } from './login/ConfirmationForm';
import { SocialLoginButtons } from './login/SocialLoginButtons';
import { TrustIndicators } from './login/TrustIndicators';
import { loginFeatures } from '../config/loginConfig';
import type { UserData } from '../types';

interface LoginPageProps {
  onLogin: (userData?: UserData) => void;
  onBackToLanding?: () => void;
}

export function LoginPage({ onLogin, onBackToLanding }: LoginPageProps) {
  const auth = useAuth(onLogin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      <LoginBackground />

      <div className="relative z-10 min-h-screen flex">
        <LoginFeatures onBackToLanding={onBackToLanding} />

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

              <AnimatePresence mode="wait">
                {auth.needsConfirmation ? (
                  <ConfirmationForm
                    email={auth.email}
                    confirmationCode={auth.confirmationCode}
                    setConfirmationCode={auth.setConfirmationCode}
                    isLoading={auth.isLoading}
                    error={auth.error}
                    onSubmit={auth.handleConfirmSignUp}
                    onResendCode={auth.handleResendCode}
                  />
                ) : (
                  <>
                    <LoginForm
                      isLogin={auth.isLogin}
                      setIsLogin={auth.setIsLogin}
                      email={auth.email}
                      setEmail={auth.setEmail}
                      password={auth.password}
                      setPassword={auth.setPassword}
                      name={auth.name}
                      setName={auth.setName}
                      acceptedTerms={auth.acceptedTerms}
                      setAcceptedTerms={auth.setAcceptedTerms}
                      isLoading={auth.isLoading}
                      error={auth.error}
                      onSubmit={auth.handleSubmit}
                    />
                    <SocialLoginButtons onSocialLogin={auth.handleSocialLogin} />
                  </>
                )}
              </AnimatePresence>

              {/* Features Preview */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider">
                  Platform Features
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {loginFeatures.slice(0, 4).map((feature, i) => (
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

            <TrustIndicators />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
