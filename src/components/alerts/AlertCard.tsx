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
        'bg-white p-4 rounded border cursor-pointer transition-all duration-300',
        'relative shadow-report',
        severity === 'critical'
          ? 'border-text-primary bg-bg-tertiary'
          : 'border-text-secondary bg-bg-secondary'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx(
          'p-3 rounded',
          severity === 'critical' ? 'bg-text-primary' : 'bg-text-secondary'
        )}>
          <Icon className={clsx(
            'w-6 h-6',
            severity === 'critical' ? 'text-white' : 'text-white'
          )} />
        </div>
        <div className="flex-1">
          <h4 className="font-sans font-semibold text-text-primary mb-1">
            {title}
          </h4>
          <p className="text-sm text-text-secondary font-sans">
            {description}
          </p>
        </div>
        {onClick && (
          <button className="px-3 py-1 text-xs font-sans font-semibold text-text-primary 
                           border border-border-color rounded hover:bg-bg-tertiary transition-colors bg-white">
            Ver detalles
          </button>
        )}
      </div>
    </motion.div>
  );
}

