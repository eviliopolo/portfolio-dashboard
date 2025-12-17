import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { RecursoCapacidad } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface PersonaCapacityCardProps {
  recurso: RecursoCapacidad;
  index?: number;
}

export default function PersonaCapacityCard({ recurso, index = 0 }: PersonaCapacityCardProps) {
  const { nombre, horasDisponibles, horasAsignadas, ocupacion, sobrecarga, estado, proyectos } = recurso;

  // Configuración según estado
  const estadoConfig = {
    sobrecargado: {
      color: '#ef4444',
      borderColor: '#fca5a5',
      label: 'Sobrecargado',
      bgClass: 'bg-red-50',
      textClass: 'text-red-600',
    },
    equilibrio: {
      color: '#f59e0b',
      borderColor: '#fcd34d',
      label: 'Equilibrio',
      bgClass: 'bg-yellow-50',
      textClass: 'text-yellow-600',
    },
    disponible: {
      color: '#10b981',
      borderColor: '#6ee7b7',
      label: 'Disponible',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-600',
    }
  };

  const config = estadoConfig[estado];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: config.borderColor }}
    >
      <div className="relative">
        {/* Barra lateral de color */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg" 
          style={{ backgroundColor: config.color }}
        />
        
        <div className="p-6 pl-8">
          {/* Header - Nombre del recurso */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-sans font-bold text-gray-900 mb-2">
                {nombre}
              </h2>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: config.color }} />
                <span 
                  className={`text-sm font-medium ${config.textClass}`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Métricas */}
          <div className="space-y-3">
            {/* Ocupación */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Ocupación:</span>
              <span className="text-2xl font-sans font-bold text-gray-900">
                {ocupacion.toFixed(1)}%
              </span>
            </div>

            {/* Capacidad - DE LA HOJA HORAS COLUMNA I */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Capacidad:</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatNumber(horasDisponibles)}h
              </span>
            </div>

            {/* Asignadas - DE LA MATRIZ_HORAS FILA 10 */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Asignadas:</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatNumber(horasAsignadas)}h
              </span>
            </div>

            {/* Sobrecarga */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Sobrecarga:</span>
              <span 
                className={`text-lg font-semibold ${
                  sobrecarga > 0 ? 'text-red-600' : sobrecarga < 0 ? 'text-green-600' : 'text-gray-900'
                }`}
              >
                {sobrecarga > 0 ? '+' : ''}{formatNumber(sobrecarga)}h
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(ocupacion, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: config.color }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-400">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Lista de proyectos */}
          {proyectos && proyectos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">
                Proyectos ({proyectos.length})
              </p>
              <div className="space-y-2">
                {proyectos.map((proyecto, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-start text-sm py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700 flex-1 mr-3 leading-snug">
                      {proyecto.proyecto}
                    </span>
                    <span className="text-gray-900 font-semibold whitespace-nowrap">
                      {formatNumber(proyecto.horas)}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

