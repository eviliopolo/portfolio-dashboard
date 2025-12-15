import { motion } from 'framer-motion';
import { AlertTriangle, Users, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertCardProps {
  type: 'recurso' | 'solapamiento' | 'proyecto';
  title: string;
  description: string;
  severity: 'critical' | 'warning';
  onClick?: () => void;
}

export default function AlertCard({ type, title, description, severity, onClick }: AlertCardProps) {
  const icons = {
    recurso: Users,
    solapamiento: Calendar,
    proyecto: AlertTriangle,
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 5 }}
      onClick={onClick}
      className={clsx(
        'bg-bg-secondary p-4 rounded-lg border-2 cursor-pointer transition-all duration-300',
        'relative overflow-hidden',
        severity === 'critical'
          ? 'border-accent-red shadow-neon-red pulse-critical'
          : 'border-accent-orange shadow-neon-orange'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx(
          'p-3 rounded-lg',
          severity === 'critical' ? 'bg-accent-red/20' : 'bg-accent-orange/20'
        )}>
          <Icon className={clsx(
            'w-6 h-6',
            severity === 'critical' ? 'text-accent-red' : 'text-accent-orange'
          )} />
        </div>
        <div className="flex-1">
          <h4 className="font-rajdhani font-bold text-text-primary mb-1">
            {title}
          </h4>
          <p className="text-sm text-text-secondary font-rajdhani">
            {description}
          </p>
        </div>
        {onClick && (
          <button className="px-3 py-1 text-xs font-rajdhani font-bold text-accent-cyan 
                           border border-accent-cyan rounded hover:bg-accent-cyan/10 transition-colors">
            Ver detalles
          </button>
        )}
      </div>
    </motion.div>
  );
}

