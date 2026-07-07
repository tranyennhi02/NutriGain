import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Premium Card Component with Glassmorphism
 */
export default function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-white border border-brand-border shadow-soft',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-soft-lg',
    gradient: 'bg-gradient-to-br from-white to-primary-50/30 border border-primary-100 shadow-soft-lg',
    elevated: 'bg-white border border-brand-border shadow-soft-xl',
  };
  
  const hoverStyles = hover ? 'hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <motion.div
      className={clsx(
        'rounded-3xl p-6',
        variants[variant],
        hoverStyles,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-xl font-bold text-brand-navy', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={clsx('text-sm text-brand-text-sub mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={clsx(className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={clsx('mt-6 pt-4 border-t border-brand-border', className)}>
      {children}
    </div>
  );
}
