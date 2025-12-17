import { motion } from 'framer-motion';
import { RecursoCapacidad } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface RecursosBarChartProps {
  recursos: RecursoCapacidad[];
}

export default function RecursosBarChart({ recursos }: RecursosBarChartProps) {
  // Ordenar por ocupación descendente
  const recursosOrdenados = [...recursos].sort((a, b) => b.ocupacion - a.ocupacion);

  const getColorByEstado = (estado: string) => {
    switch (estado) {
      case 'sobrecargado':
        return '#ef4444'; // red-500
      case 'equilibrio':
        return '#f59e0b'; // amber-500
      case 'disponible':
        return '#10b981'; // emerald-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border-2 border-border-color shadow-elegant">
      <div className="mb-6">
        <h2 className="text-lg font-sans font-semibold text-text-primary mb-2">
          Nivel de Ocupación por Recurso
        </h2>
        <p className="text-sm text-text-muted">
          Distribución de carga de trabajo de cada colaborador
        </p>
      </div>

      <div className="space-y-4">
        {recursosOrdenados.map((recurso, index) => {
          const color = getColorByEstado(recurso.estado);
          const porcentajeParaBarra = Math.min(recurso.ocupacion, 200); // Limitar visualmente a 200%

          return (
            <motion.div
              key={recurso.nombre}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              {/* Header con nombre y valores */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-sans font-semibold text-text-primary text-sm min-w-[140px]">
                    {recurso.nombre}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatNumber(recurso.horasAsignadas)}h / {formatNumber(recurso.horasDisponibles)}h
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-sm font-sans font-bold"
                    style={{ color }}
                  >
                    {recurso.ocupacion.toFixed(1)}%
                  </span>
                  {recurso.sobrecarga > 0 && (
                    <span className="text-xs text-red-600 font-semibold">
                      (+{formatNumber(recurso.sobrecarga)}h)
                    </span>
                  )}
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                {/* Barra principal */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(recurso.ocupacion, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="absolute h-full rounded-lg"
                  style={{ backgroundColor: color }}
                />
                
                {/* Barra de sobrecarga (si supera el 100%) */}
                {recurso.ocupacion > 100 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(recurso.ocupacion - 100, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                    className="absolute h-full rounded-lg"
                    style={{ 
                      backgroundColor: '#dc2626', // red-600
                      left: '100%',
                      opacity: 0.8
                    }}
                  />
                )}

                {/* Línea de referencia 100% */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 opacity-50" />

                {/* Etiqueta dentro de la barra */}
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-medium text-white drop-shadow-md">
                    {recurso.proyectos.length} proyecto{recurso.proyectos.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-text-muted">Disponible (&lt;95%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-text-muted">Equilibrio (95-100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-text-muted">Sobrecargado (&gt;100%)</span>
        </div>
      </div>
    </div>
  );
}

