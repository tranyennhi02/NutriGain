import { motion } from 'framer-motion';

/**
 * Animated Background with Floating Blobs and Gradients
 */
export default function AnimatedBackground({ variant = 'default', children }) {
  const variants = {
    default: (
      <>
        {/* Gradient Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-primary-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-br from-secondary-400/20 to-secondary-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-accent-400/20 to-accent-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 30, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </>
    ),
    hero: (
      <>
        {/* Hero Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
          
          {/* Animated Blobs */}
          <motion.div
            className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary-300/30 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-radial from-secondary-300/30 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-radial from-accent-300/20 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>
      </>
    ),
    particles: (
      <>
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </>
    ),
  };
  
  return (
    <div className="relative">
      {variants[variant]}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Floating Food Icons Component
 */
export function FloatingIcons({ icons = ['🥗', '🥑', '🍎', '🥕', '🥦', '🍊', '🥚', '🐟'] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
          }}
          animate={{
            y: [null, (Math.random() * 100) + '%'],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
}
