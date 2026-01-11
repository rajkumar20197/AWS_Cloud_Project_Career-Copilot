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
    sm: { icon: 48, text: 'text-lg', container: 'h-12' },
    md: { icon: 56, text: 'text-xl', container: 'h-14' },
    lg: { icon: 72, text: 'text-2xl', container: 'h-16' },
    xl: { icon: 96, text: 'text-3xl', container: 'h-20' }
  };

  const currentSize = sizes[size];

  // Logo Icon - Bright and Visible (ChatGPT style)
  const LogoIcon = () => (
    <motion.div
      className={`relative flex items-center justify-center`}
      style={{ width: currentSize.icon, height: currentSize.icon }}
      initial={animated ? { scale: 0.9, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Brain logo - bright and visible, no background */}
      <img
        src="/logo-icon.png"
        alt="Agentic AI Career Coach Logo"
        className="w-full h-full object-contain"
        style={{
          filter: 'brightness(1.1) contrast(1.05)'
        }}
      />
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
        Agentic AI
      </span>
      <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold">Career Coach</span>
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
      <img
        src="/logo-icon.png"
        alt="Agentic AI Career Coach"
        className="w-full h-full object-contain"
        style={{
          filter: 'drop-shadow(0 2px 6px rgba(0, 212, 255, 0.2))'
        }}
      />
    </div>
  );
}

// Badge logo variant
export function LogoBadge({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img
        src="/logo-icon.png"
        alt="Agentic AI Career Coach"
        className="w-full h-full object-contain"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 212, 255, 0.3))'
        }}
      />
    </div>
  );
}
