/**
 * AI Career Agent Platform - Enhanced Landing Page Component
 * Copyright (c) 2025 AI Career Agent Coach
 * 
 * This file is part of the AI Career Agent Platform project.
 * Licensed under the MIT License - see LICENSE file for details.
 * 
 * @author AI Career Agent Coach
 * @created 2025
 */

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { HowItWorksVisual } from './HowItWorksVisual';
import { VideoModal } from './VideoModal';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Calendar,
  TrendingUp,
  Mail,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  Users,
  Award,
  BarChart3,
  Rocket,
  Star,
  Clock,
  Play,
} from 'lucide-react';

interface EnhancedLandingPageProps {
  onGetStarted: () => void;
}

export function EnhancedLandingPage({ onGetStarted }: EnhancedLandingPageProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Hide welcome animation after 3 seconds
  useState(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: '0-100 compatibility scores using AWS Bedrock Claude 3.5 Haiku',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1,
    },
    {
      icon: Calendar,
      title: 'Auto-Scheduling',
      description: 'Gmail scanning with automatic interview booking on your calendar',
      color: 'from-purple-500 to-pink-500',
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Real-time salary trends and skill demand forecasting',
      color: 'from-orange-500 to-red-500',
      delay: 0.3,
    },
    {
      icon: Mail,
      title: 'Gmail Integration',
      description: 'Automated interview detection and response management',
      color: 'from-green-500 to-emerald-500',
      delay: 0.4,
    },
    {
      icon: Target,
      title: 'Resume Optimizer',
      description: 'ATS-optimized resumes with AI-powered suggestions',
      color: 'from-indigo-500 to-purple-500',
      delay: 0.5,
    },
    {
      icon: Zap,
      title: '24/7 Automation',
      description: 'Continuous job scanning across LinkedIn, Indeed, Glassdoor',
      color: 'from-yellow-500 to-orange-500',
      delay: 0.6,
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Jobs Matched', color: 'text-blue-500' },
    { icon: Award, value: '92%', label: 'AI Accuracy', color: 'text-purple-500' },
    { icon: Clock, value: '10hrs', label: 'Time Saved/Week', color: 'text-green-500' },
    { icon: Rocket, value: '2.5x', label: 'Faster Hiring', color: 'text-orange-500' },
  ];

  const awsServices = [
    { name: 'AWS Bedrock', description: 'AI Foundation' },
    { name: 'Lambda', description: 'Serverless Compute' },
    { name: 'DynamoDB', description: 'NoSQL Database' },
    { name: 'API Gateway', description: 'REST API' },
    { name: 'S3', description: 'File Storage' },
    { name: 'Cognito', description: 'Authentication' },
    { name: 'CloudFormation', description: 'Infrastructure as Code' },
    { name: 'CloudWatch', description: 'Monitoring' },
    { name: 'Step Functions', description: 'Orchestration' },
    { name: 'OpenSearch', description: 'Search & Analytics' },
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'CS Graduate',
      company: 'Tech Corp',
      avatar: '🎓',
      text: 'Got my dream job 3 months before graduation! The AI matched me perfectly.',
      rating: 5,
    },
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'StartupXYZ',
      avatar: '👩‍💻',
      text: 'Interview scheduling was automatic. Saved me 15+ hours of back-and-forth emails.',
      rating: 5,
    },
    {
      name: 'Marcus Williams',
      role: 'Data Scientist',
      company: 'AI Labs',
      avatar: '🧑‍🔬',
      text: 'The resume optimizer increased my response rate by 3x. Game changer!',
      rating: 5,
    },
  ];

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
            <Logo size="xl" animated={false} onClick={scrollToTop} />
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

      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{ y }}
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
          />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          style={{ opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm mb-6">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Powered by AWS Bedrock AI
              </Badge>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl tracking-tight max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              From Graduation to
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dream Job
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl mt-4 text-slate-600">
                ✨
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Set your graduation date. Let AI handle job search, applications,
              interview scheduling, and career prep—all while you focus on studying.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg group"
              >
                Start Your Career Journey
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg group"
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch 3-Minute Demo
              </Button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                  <div className={`text-4xl ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 pt-12 text-sm text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>AWS Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="text-sm">Scroll to explore</span>
            <ArrowRight className="w-5 h-5 rotate-90" />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-5xl mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Six powerful features working together to automate your entire career journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
              >
                <Card className="p-6 h-full hover:shadow-2xl transition-all hover:-translate-y-2 border-slate-200 group cursor-pointer overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Workflow Interactive Guide */}
      <div id="how-it-works" className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <HowItWorksVisual />
      </div>

      {/* Technology Stack */}
      <div id="technology" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Technology</Badge>
            <h2 className="text-5xl mb-4">Enterprise-Grade AWS Infrastructure</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              10 AWS services orchestrated for reliability, security, and scalability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {awsServices.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group cursor-pointer"
              >
                <div className="text-3xl mb-2">☁️</div>
                <div className="text-sm mb-1 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </div>
                <div className="text-xs text-slate-500">{service.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-5xl mb-4">Loved by Graduates</h2>
            <p className="text-xl text-slate-600">
              Join thousands who found their dream jobs with AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div>{testimonial.name}</div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of students who automated their career journey with AI.
              Start free today—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg"
              >
                Get Started Free
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <Logo size="lg" variant="full" onClick={scrollToTop} />
              <p className="text-slate-500 text-sm max-w-sm">
                AI-powered career platform helping graduates land their dream jobs with automation and intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">License (MIT)</a>
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
            <div>
              <h4 className="text-white mb-4">Technology</h4>
              <div className="flex flex-col gap-2 text-sm">
                <span>Powered by AWS Bedrock</span>
                <span>Built with React & TypeScript</span>
                <span>Serverless Architecture</span>
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm">
                <strong className="text-white">© 2025 AI Career Agent Coach.</strong> All rights reserved.
              </div>
              <div className="text-sm">
                Licensed under <span className="text-blue-400">MIT License</span> • Open Source
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://youtu.be/1p2vUa1705g"
      />
    </div>
  );
}