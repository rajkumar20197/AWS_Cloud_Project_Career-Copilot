import { motion } from 'motion/react';
import { generateParticles } from '../../config/loginConfig';

export function LoginBackground() {
    const particles = generateParticles();

    return (
        <>
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: particle.size,
                            height: particle.size,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                        }}
                    />
                ))}
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </>
    );
}
