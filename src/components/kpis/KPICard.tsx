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
    good: 'border-border-color bg-white',
    warning: 'border-border-color bg-white',
    critical: 'border-text-primary bg-bg-tertiary',
    normal: 'border-border-color bg-white',
  };

  const displayValue = typeof value === 'number' 
    ? (unit === '%' ? formatPercentage(value) : formatNumber(value))
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded border ${statusColors[status]} 
                  shadow-report transition-all duration-300 relative`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-6 h-6 text-text-primary" />
          {trend !== undefined && (
            <span
              className={`text-sm font-sans font-semibold ${
                trend > 0 ? 'text-text-primary' : 'text-text-secondary'
              }`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>

        <div className="mb-2">
          <h3 className="text-text-muted text-xs font-sans uppercase tracking-wider">
            {title}
          </h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-sans font-bold text-text-primary">
            {displayValue}
          </span>
          {unit && unit !== '%' && (
            <span className="text-text-secondary text-sm font-sans">
              {unit}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

