import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { formatNumber, formatPercentage } from '../../utils/formatters';

interface KPICardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit: string;
  status: 'good' | 'warning' | 'critical' | 'normal';
  trend?: number;
}

export default function KPICard({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  status, 
  trend 
}: KPICardProps) {
  const statusColors = {
    good: 'border-accent-green shadow-neon-green',
    warning: 'border-accent-orange shadow-neon-orange',
    critical: 'border-accent-red shadow-neon-red',
    normal: 'border-accent-cyan shadow-neon-cyan',
  };

  const statusGlow = {
    good: 'hover:shadow-neon-green',
    warning: 'hover:shadow-neon-orange',
    critical: 'hover:shadow-neon-red pulse-critical',
    normal: 'hover:shadow-neon-cyan',
  };

  const displayValue = typeof value === 'number' 
    ? (unit === '%' ? formatPercentage(value) : formatNumber(value))
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className={`bg-bg-secondary p-6 rounded-lg border-2 ${statusColors[status]} 
                  ${statusGlow[status]} transition-all duration-300 relative overflow-hidden`}
    >
      {/* Efecto de fondo sutil */}
      <div className="absolute inset-0 opacity-5 cyber-grid"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8 text-accent-cyan" />
          {trend !== undefined && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className={`text-sm font-rajdhani font-bold ${
                trend > 0 ? 'text-accent-green' : 'text-accent-red'
              }`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </motion.span>
          )}
        </div>

        <div className="mb-2">
          <h3 className="text-text-secondary text-sm font-rajdhani uppercase tracking-wider">
            {title}
          </h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-orbitron font-bold text-text-primary">
            {displayValue}
          </span>
          {unit && unit !== '%' && (
            <span className="text-text-secondary text-sm font-rajdhani">
              {unit}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

