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

  // Logo Icon - Circuit Brain with Growth Arrow
  const LogoIcon = () => (
    <motion.img
      src="/logo.svg"
      alt="AI Career Agent"
      width={currentSize.icon}
      height={currentSize.icon}
      className={className}
      initial={animated ? { scale: 0, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
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
      <span className="text-slate-800 font-bold">Career Agent</span>
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
    <img
      src="/logo.svg"
      alt="AI Career Agent"
      width={size}
      height={size}
      className={className}
    />
  );
}

// Badge logo variant
export function LogoBadge({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="AI Career Agent"
      width={size}
      height={size}
      className={className}
    />
  );
}
