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

import { Shield } from 'lucide-react';

interface CopyrightProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export function Copyright({ variant = 'full', className = '' }: CopyrightProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <div className={`text-sm text-slate-500 ${className}`}>
        © {currentYear} Agentic AI Career Coach
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`text-sm text-slate-600 ${className}`}>
        © {currentYear} Agentic AI Career Coach • MIT License
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
        <Shield className="w-4 h-4 text-green-500" />
        <span className="font-medium">© {currentYear} Agentic AI Career Coach</span>
      </div>
      <div className="text-xs text-slate-500">
        Licensed under MIT License • Open Source • All rights reserved
      </div>
    </div>
  );
}