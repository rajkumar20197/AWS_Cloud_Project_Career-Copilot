/**
 * AI Career Agent Platform - Enhanced Landing Page Component (Refactored)
 * Copyright (c) 2025 AI Career Agent Coach
 * 
 * Refactored for better performance with lazy loading and code splitting
 * 
 * @author AI Career Agent Coach
 * @created 2025
 */

import { useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { VideoModal } from './VideoModal';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { NavigationPage } from '../types';

// Lazy load sections for better performance
const HeroSection = lazy(() => import('./landing/HeroSection').then(m => ({ default: m.HeroSection })));
const FeaturesSection = lazy(() => import('./landing/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const TechnologySection = lazy(() => import('./landing/TechnologySection').then(m => ({ default: m.TechnologySection })));
const TestimonialsSection = lazy(() => import('./landing/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const CTASection = lazy(() => import('./landing/CTASection').then(m => ({ default: m.CTASection })));
const LandingFooter = lazy(() => import('./landing/LandingFooter').then(m => ({ default: m.LandingFooter })));

// Lazy load HowItWorksVisual
const HowItWorksVisual = lazy(() => import('./HowItWorksVisual').then(m => ({ default: m.HowItWorksVisual })));

interface EnhancedLandingPageProps {
  onGetStarted: () => void;
  onNavigate?: (page: NavigationPage) => void;
}

/**
 * Loading Component
 * Shown while sections are being lazy loaded
 */
function SectionLoader() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}

/**
 * Enhanced Landing Page Component
 * Main landing page with lazy-loaded sections for optimal performance
 */
export function EnhancedLandingPage({ onGetStarted, onNavigate }: EnhancedLandingPageProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Hide welcome animation after 3 seconds
  useState(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sticky Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo size="md" animated={false} onClick={scrollToTop} />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-700 hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a href="#technology" className="text-slate-700 hover:text-blue-600 transition-colors">
                Technology
              </a>
              <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Welcome Animation Overlay */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 2.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="mb-6"
            >
              <Sparkles className="w-24 h-24 text-white mx-auto" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl font-bold text-white mb-4"
            >
              Welcome to AI Career Agent
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl text-white/90"
            >
              Your AI-powered career companion
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section - Load immediately (above the fold) */}
      <Suspense fallback={<SectionLoader />}>
        <HeroSection onGetStarted={onGetStarted} onWatchDemo={() => setIsVideoOpen(true)} />
      </Suspense>

      {/* Features Section - Lazy load */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>

      {/* AI Workflow Interactive Guide - Lazy load */}
      <div id="how-it-works" className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Suspense fallback={<SectionLoader />}>
          <HowItWorksVisual />
        </Suspense>
      </div>

      {/* Technology Stack - Lazy load */}
      <Suspense fallback={<SectionLoader />}>
        <TechnologySection />
      </Suspense>

      {/* Testimonials - Lazy load */}
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>

      {/* Final CTA - Lazy load */}
      <Suspense fallback={<SectionLoader />}>
        <CTASection onGetStarted={onGetStarted} onNavigate={onNavigate} />
      </Suspense>

      {/* Footer - Lazy load */}
      <Suspense fallback={<SectionLoader />}>
        <LandingFooter onNavigate={onNavigate} />
      </Suspense>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://youtu.be/1p2vUa1705g"
      />
    </div>
  );
}