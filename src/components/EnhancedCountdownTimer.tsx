import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, Calendar, Rocket, ArrowRight } from 'lucide-react';

interface EnhancedCountdownTimerProps {
  graduationDate: string;
  onContinue: () => void;
  onAddToCalendar?: () => void;
}

export function EnhancedCountdownTimer({ graduationDate, onContinue, onAddToCalendar }: EnhancedCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(graduationDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [graduationDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'DAYS', color: 'from-pink-500 to-rose-500' },
    { value: timeLeft.hours, label: 'HOURS', color: 'from-purple-500 to-pink-500' },
    { value: timeLeft.minutes, label: 'MINUTES', color: 'from-blue-500 to-purple-500' },
    { value: timeLeft.seconds, label: 'SECONDS', color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Background with Gradient Overlay */}
      <div className="absolute inset-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700" />
        
        {/* Animated gradient overlay */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 40, 200, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(200, 40, 120, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(40, 120, 200, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(120, 40, 200, 0.4) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.5 + 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-6"
          >
            <Rocket className="w-20 h-20 text-white drop-shadow-2xl" />
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl mb-4 text-white">
            <span className="block mb-2 font-light tracking-wider opacity-90">LAUNCHING SOON</span>
            <span className="block font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Your Career Journey
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 tracking-wide">
            Time left until your graduation
          </p>
        </motion.div>

        {/* Countdown Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className={`absolute -inset-2 bg-gradient-to-r ${unit.color} rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
                {/* Number Display with 3D effect */}
                <div className="relative mb-3">
                  {/* Shadow layers for 3D depth */}
                  <div className="absolute inset-0 text-7xl md:text-8xl font-black text-white/5 blur-sm transform translate-x-1 translate-y-1">
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <div className="absolute inset-0 text-7xl md:text-8xl font-black text-white/10 transform translate-x-0.5 translate-y-0.5">
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  
                  {/* Main number */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={unit.value}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative text-7xl md:text-8xl font-black bg-gradient-to-br ${unit.color} bg-clip-text text-transparent`}
                      style={{
                        filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))',
                      }}
                    >
                      {unit.value.toString().padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Label */}
                <div className={`text-sm md:text-base font-bold tracking-widest bg-gradient-to-r ${unit.color} bg-clip-text text-transparent`}>
                  {unit.label}
                </div>

                {/* Decorative line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className={`mt-3 h-1 bg-gradient-to-r ${unit.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivation Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mb-12"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-3xl mx-auto">
            <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl mb-4 text-white">
              Get Ready for Your Dream Career! 🎓
            </h3>
            <p className="text-lg text-white/80 leading-relaxed">
              Once you graduate, our AI will automatically apply to jobs, schedule interviews, 
              and help you land your dream position. Everything is set up and ready to go!
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-xl shadow-2xl border-0 group"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              onClick={onAddToCalendar}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Add to Calendar
            </Button>
          </motion.div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 text-sm mb-3">Your automated career journey starts in</p>
          <div className="max-w-md mx-auto bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-xl">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '75%' }}
              transition={{ delay: 1.6, duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)',
              }}
            />
          </div>
          <p className="text-white/60 text-xs mt-2">Platform setup: 75% complete</p>
        </motion.div>
      </div>
    </div>
  );
}
