/**
 * Agentic AI Career Coach
 * Copyright (c) 2025 Agentic AI Career Coach | By Rajkumar Thota
 *
 * This file is part of the Agentic AI Career Coach project.
 * Licensed under the MIT License - see LICENSE file for details.
 *
 * @author Rajkumar Thota <rajkumarthota20197@gmail.com>
 * @created January 11, 2026
 */

import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Rocket } from 'lucide-react';
import type { NavigationPage } from '../../types';

interface CTASectionProps {
    onGetStarted: () => void;
    onNavigate?: (page: NavigationPage) => void;
}

/**
 * CTA Section Component
 * Final call-to-action section with gradient background
 */
export function CTASection({ onGetStarted, onNavigate }: CTASectionProps) {
    return (
        <div className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <h2 className="text-5xl md:text-6xl font-bold">
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
                            onClick={() => onNavigate?.('contact')}
                        >
                            Schedule a Demo
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
