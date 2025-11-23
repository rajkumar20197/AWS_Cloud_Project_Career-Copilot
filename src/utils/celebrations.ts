import confetti from 'canvas-confetti';

export const celebrate = {
  // Profile completed celebration
  profileComplete: () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899']
    });
  },

  // Job saved celebration
  jobSaved: () => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#10b981', '#3b82f6']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#10b981', '#3b82f6']
    });
  },

  // Application submitted celebration
  applicationSubmitted: () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#8b5cf6']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ec4899', '#f59e0b']
      });
    }, 250);
  },

  // Interview scheduled celebration
  interviewScheduled: () => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.5 },
      colors: ['#8b5cf6', '#ec4899', '#f59e0b']
    });
  },

  // Offer received celebration (BIG!)
  offerReceived: () => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#ffed4e', '#ff6b6b']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#ffed4e', '#ff6b6b']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    }());
  },

  // Simple success
  success: () => {
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10b981', '#3b82f6']
    });
  }
};
