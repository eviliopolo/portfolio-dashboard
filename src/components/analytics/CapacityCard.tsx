import { AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { AnalisisCapacidad } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface CapacityCardProps {
  capacidadEquipo?: AnalisisCapacidad;
}

export default function CapacityCard({ capacidadEquipo }: CapacityCardProps) {
  if (!capacidadEquipo) {
    return null;
  }

  const { horasDisponibles, horasRequeridas, porcentajeOcupacion, deficit, estado } = capacidadEquipo;

  // Configuración según estado
  const estadoConfig = {
    sobrecarga: {
      color: 'red',
      icon: AlertTriangle,
      mensaje: 'Equipo Sobrecargado',
      descripcion: `Déficit de ${Math.abs(deficit).toFixed(0)}h`,
      bgClass: 'from-red-50 to-red-100',
      borderClass: 'border-red-200',
      iconClass: 'text-red-700',
      bgIconClass: 'bg-red-200'
    },
    equilibrio: {
      color: 'yellow',
      icon: Target,
      mensaje: 'Capacidad Límite',
      descripcion: 'Utilizando casi toda la capacidad',
      bgClass: 'from-yellow-50 to-yellow-100', 
      borderClass: 'border-yellow-200',
      iconClass: 'text-yellow-700',
      bgIconClass: 'bg-yellow-200'
    },
    disponible: {
      color: 'green',
      icon: CheckCircle,
      mensaje: 'Capacidad Disponible',
      descripcion: `${Math.abs(deficit).toFixed(0)}h libres`,
      bgClass: 'from-green-50 to-green-100',
      borderClass: 'border-green-200', 
      iconClass: 'text-green-700',
      bgIconClass: 'bg-green-200'
    }
  };

  const config = estadoConfig[estado];
  const IconComponent = config.icon;

  const barColor = config.color === 'red' ? '#ef4444' : config.color === 'yellow' ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-white p-8 rounded-xl border-2 border-border-color shadow-elegant relative">
      {/* Barra lateral de color */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: barColor }}></div>
      
      <div className="pl-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">
              Capacidad vs Demanda
            </p>
            <p className="text-3xl font-sans font-bold text-text-primary">
              {porcentajeOcupacion.toFixed(0)}%
            </p>
            <p className="text-xs text-text-muted mt-1">
              {config.mensaje}
            </p>
          </div>
          <div className="p-2 bg-bg-tertiary rounded-lg">
            <IconComponent className="w-5 h-5" style={{ color: barColor }} />
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted">
              Disponibles:
            </span>
            <span className="font-semibold text-text-primary">
              {formatNumber(horasDisponibles)}h
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted">
              Requeridas:
            </span>
            <span className="font-semibold text-text-primary">
              {formatNumber(horasRequeridas)}h
            </span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                backgroundColor: barColor,
                width: `${Math.min(porcentajeOcupacion, 100)}%` 
              }}
            />
            {/* Si está sobrecargado, mostrar barra adicional */}
            {porcentajeOcupacion > 100 && (
              <div 
                className="h-full rounded-full relative -mt-2"
                style={{ 
                  backgroundColor: '#dc2626',
                  width: `${Math.min(porcentajeOcupacion - 100, 50)}%` 
                }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-text-muted">0%</span>
            <span className="text-text-muted">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
