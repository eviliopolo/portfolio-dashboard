import { motion } from 'framer-motion';
import { Calendar, Users, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Proyecto } from '../../types';
import { formatDate } from '../../utils/formatters';
import { clsx } from 'clsx';

interface ProyectoCardProps {
  proyecto: Proyecto;
  onClick?: () => void;
}

export default function ProyectoCard({ proyecto, onClick }: ProyectoCardProps) {
  const isAtrasado = proyecto.Estado === 'Atrasado';

  const estadoColors = {
    'Programado': 'border-border-color text-text-secondary bg-white',
    'En_Progreso': 'border-text-secondary text-text-secondary bg-bg-secondary',
    'Atrasado': 'border-text-primary text-text-primary bg-bg-tertiary',
  };

  const prioridadColors = {
    'Alta': 'bg-bg-tertiary text-text-primary border-text-primary',
    'Media': 'bg-bg-secondary text-text-secondary border-border-color',
    'Baja': 'bg-white text-text-secondary border-border-color',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className={clsx(
        'bg-white p-6 rounded border cursor-pointer',
        'transition-all duration-300 relative overflow-hidden shadow-report',
        estadoColors[proyecto.Estado as keyof typeof estadoColors] || 'border-border-color',
        'hover:shadow-report-md'
      )}
    >
      {/* Barra de color lateral */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-accent-primary"
      />

      <div className="ml-4">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-sans font-semibold text-text-primary">
            {proyecto.Proyecto}
          </h3>
          {isAtrasado && (
            <AlertCircle className="w-4 h-4 text-text-primary" />
          )}
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <span
            className={clsx(
              'px-3 py-1 rounded text-xs font-sans font-semibold uppercase border',
              estadoColors[proyecto.Estado as keyof typeof estadoColors] || 'border-border-color'
            )}
          >
            {proyecto.Estado.replace('_', ' ')}
          </span>
          <span
            className={clsx(
              'px-3 py-1 rounded text-xs font-sans font-semibold uppercase border',
              prioridadColors[proyecto.Prioridad as keyof typeof prioridadColors] || 'border-border-color'
            )}
          >
            {proyecto.Prioridad}
          </span>
        </div>

        {/* Fechas */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span className="font-sans">Inicio: {formatDate(proyecto.Inicio)}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span className="font-sans">Fin: {formatDate(proyecto.Fin)}</span>
          </div>
          <div className="flex items-center gap-2 text-text-primary">
            <Calendar className="w-4 h-4" />
            <span className="font-sans font-semibold">Entrega: {formatDate(proyecto.Entrega)}</span>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-color">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-text-muted" />
            <div>
              <div className="text-xs text-text-muted font-sans">Tareas</div>
              <div className="text-sm font-sans font-semibold">{proyecto.Tareas}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" />
            <div>
              <div className="text-xs text-text-muted font-sans">Horas</div>
              <div className="text-sm font-sans font-semibold">{proyecto.Horas_Totales}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-text-muted" />
            <div>
              <div className="text-xs text-text-muted font-sans">Recursos</div>
              <div className="text-sm font-sans font-semibold">{proyecto.Recursos}</div>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        {proyecto.Progreso !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-muted mb-1 font-sans">
              <span>Progreso</span>
              <span>{proyecto.Progreso}%</span>
            </div>
            <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${proyecto.Progreso}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-accent-primary"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

