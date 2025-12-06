import { motion } from 'motion/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Logo({ 
  size = 'md', 
  variant = 'full', 
  animated = false,
  className = '',
  onClick
}: LogoProps) {
  const sizes = {
    sm: { icon: 40, text: 'text-xl', container: 'h-12' },
    md: { icon: 48, text: 'text-2xl', container: 'h-14' },
    lg: { icon: 64, text: 'text-4xl', container: 'h-20' },
    xl: { icon: 80, text: 'text-6xl', container: 'h-28' }
  };

  const currentSize = sizes[size];

  // Logo Icon - Modern AI Brain with Career Growth
  const LogoIcon = () => (
    <motion.div
      className={`relative flex items-center justify-center`}
      style={{ width: currentSize.icon, height: currentSize.icon }}
      initial={animated ? { scale: 0, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Outer Ring - Career Growth */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          {/* Inner AI Brain */}
          <div className="relative">
            {/* Brain Core */}
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Neural Network Lines */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full opacity-60"></div>
            
            {/* Growth Arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Logo Text
  const LogoText = () => (
    <motion.div
      className={`${currentSize.text} font-bold tracking-tight flex items-center gap-2`}
      initial={animated ? { opacity: 0, x: -20 } : undefined}
      animate={animated ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">
        AI
      </span>
      <span className="text-slate-800 font-bold">Career</span>
      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
        Coach
      </span>
    </motion.div>
  );

  const wrapperClasses = `${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`;

  if (variant === 'icon') {
    return (
      <div className={wrapperClasses} onClick={onClick}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={wrapperClasses} onClick={onClick}>
        <LogoText />
      </div>
    );
  }

  // Full logo (icon + text)
  return (
    <div 
      className={`flex items-center gap-3 ${currentSize.container} ${className} ${wrapperClasses}`}
      onClick={onClick}
    >
      <LogoIcon />
      <LogoText />
    </div>
  );
}

// Minimal logo variant
export function LogoMinimal({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Badge logo variant
export function LogoBadge({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <div className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI
          </div>
        </div>
      </div>
    </div>
  );
}
