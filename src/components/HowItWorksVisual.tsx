import { motion } from 'motion/react';
import { Target, Sparkles, Crosshair, Trophy } from 'lucide-react';

export function HowItWorksVisual() {
  const steps = [
    {
      number: '1',
      title: 'Set graduation date',
      icon: Target,
      color: 'from-blue-500 to-cyan-400',
      shadowColor: 'shadow-blue-500/50',
      glowColor: 'bg-blue-500/20',
      rotation: -5,
    },
    {
      number: '2',
      title: 'AI scans job portals',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-400',
      shadowColor: 'shadow-purple-500/50',
      glowColor: 'bg-purple-500/20',
      rotation: 5,
    },
    {
      number: '3',
      title: 'Smart job matching',
      icon: Crosshair,
      color: 'from-orange-500 to-yellow-400',
      shadowColor: 'shadow-orange-500/50',
      glowColor: 'bg-orange-500/20',
      rotation: -3,
    },
    {
      number: '4',
      title: 'Land dream job!',
      icon: Trophy,
      color: 'from-green-500 to-emerald-400',
      shadowColor: 'shadow-green-500/50',
      glowColor: 'bg-green-500/20',
      rotation: 3,
    },
  ];

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl mb-4">HOW IT WORKS</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your journey from graduation to dream job
          </p>
        </motion.div>

        {/* 3D Visual Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 0,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
                style={{ perspective: '1000px' }}
              >
                {/* Card Container with 3D Effect */}
                <div
                  className="relative"
                  style={{
                    transform: `rotateY(${step.rotation}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s ease',
                  }}
                >
                  {/* Glow Effect */}
                  <div className={`absolute -inset-4 ${step.glowColor} rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Main Card */}
                  <div className={`relative bg-gradient-to-br ${step.color} p-1 rounded-2xl shadow-2xl ${step.shadowColor} group-hover:shadow-3xl transition-all duration-500`}>
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 h-full">
                      {/* Step Number - 3D Style */}
                      <div className="relative mb-6">
                        <div 
                          className="text-8xl font-black text-white/10 absolute -top-4 -left-2"
                          style={{
                            textShadow: '4px 4px 0px rgba(255,255,255,0.05)',
                            transform: 'translateZ(20px)',
                          }}
                        >
                          {step.number}
                        </div>
                        <div 
                          className={`text-6xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent relative z-10`}
                          style={{
                            transform: 'translateZ(40px)',
                            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                          }}
                        >
                          {step.number}
                        </div>
                      </div>

                      {/* Icon Container - Floating 3D */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotateZ: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="mb-6 relative"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Icon Shadow Layers for 3D depth */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-xl opacity-40`} 
                          style={{ transform: 'translateZ(-20px)' }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-md opacity-60`} 
                          style={{ transform: 'translateZ(-10px)' }}
                        />
                        
                        {/* Main Icon */}
                        <div 
                          className={`relative bg-gradient-to-br ${step.color} p-6 rounded-2xl`}
                          style={{ transform: 'translateZ(30px)' }}
                        >
                          <Icon className="w-12 h-12 text-white" strokeWidth={2.5} />
                        </div>
                      </motion.div>

                      {/* Title with 3D effect */}
                      <h3 
                        className="text-xl font-bold text-white mb-2 capitalize"
                        style={{
                          transform: 'translateZ(20px)',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        {step.title}
                      </h3>

                      {/* Decorative elements */}
                      <div className="mt-4 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 + i * 0.05, duration: 0.3 }}
                            className={`h-1 flex-1 bg-gradient-to-r ${step.color} rounded-full`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector (except for last item) */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                    className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10"
                  >
                    <div className="relative">
                      {/* Glowing arrow */}
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                          <defs>
                            <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                              <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 5 20 L 40 20 M 35 12 L 45 20 L 35 28"
                            stroke={`url(#gradient-${index})`}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            filter="drop-shadow(0 0 8px rgba(255,255,255,0.4))"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-2xl text-slate-300 mb-6">
            All this happens <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold">automatically</span> once you set your graduation date
          </p>
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 40px rgba(59, 130, 246, 0.8)',
                '0 0 20px rgba(59, 130, 246, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block rounded-full"
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200" />
              <div className="relative px-1 py-1 bg-slate-900 rounded-full">
                <div className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold">
                  Experience the Magic ✨
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
