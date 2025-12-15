import { motion } from 'framer-motion';
import { Calendar, Users, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Proyecto } from '../../types';
import { formatDate, getProjectColor } from '../../utils/formatters';
import { clsx } from 'clsx';

interface ProyectoCardProps {
  proyecto: Proyecto;
  onClick?: () => void;
}

export default function ProyectoCard({ proyecto, onClick }: ProyectoCardProps) {
  const color = proyecto.Color || getProjectColor(proyecto.Proyecto);
  const isAtrasado = proyecto.Estado === 'Atrasado';
  const isEnProgreso = proyecto.Estado === 'En_Progreso';

  const estadoColors = {
    'Programado': 'border-accent-cyan text-accent-cyan',
    'En_Progreso': 'border-accent-green text-accent-green',
    'Atrasado': 'border-accent-red text-accent-red',
  };

  const prioridadColors = {
    'Alta': 'bg-accent-red/20 text-accent-red border-accent-red',
    'Media': 'bg-accent-orange/20 text-accent-orange border-accent-orange',
    'Baja': 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className={clsx(
        'bg-bg-secondary p-6 rounded-lg border-2 cursor-pointer',
        'transition-all duration-300 relative overflow-hidden',
        estadoColors[proyecto.Estado as keyof typeof estadoColors] || 'border-accent-cyan',
        isAtrasado && 'pulse-critical'
      )}
      style={{
        boxShadow: `0 0 15px ${color}40`,
      }}
    >
      {/* Barra de color lateral */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: color }}
      />

      <div className="ml-4">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-orbitron font-bold text-text-primary">
            {proyecto.Proyecto}
          </h3>
          {isAtrasado && (
            <AlertCircle className="w-5 h-5 text-accent-red animate-pulse" />
          )}
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <span
            className={clsx(
              'px-3 py-1 rounded text-xs font-rajdhani font-bold uppercase border',
              estadoColors[proyecto.Estado as keyof typeof estadoColors] || 'border-accent-cyan'
            )}
          >
            {proyecto.Estado.replace('_', ' ')}
          </span>
          <span
            className={clsx(
              'px-3 py-1 rounded text-xs font-rajdhani font-bold uppercase border',
              prioridadColors[proyecto.Prioridad as keyof typeof prioridadColors] || 'border-accent-cyan'
            )}
          >
            {proyecto.Prioridad}
          </span>
        </div>

        {/* Fechas */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Inicio: {formatDate(proyecto.Inicio)}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Fin: {formatDate(proyecto.Fin)}</span>
          </div>
          <div className="flex items-center gap-2 text-accent-cyan">
            <Calendar className="w-4 h-4" />
            <span className="font-bold">Entrega: {formatDate(proyecto.Entrega)}</span>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-color">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-accent-cyan" />
            <div>
              <div className="text-xs text-text-secondary">Tareas</div>
              <div className="text-sm font-orbitron font-bold">{proyecto.Tareas}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-cyan" />
            <div>
              <div className="text-xs text-text-secondary">Horas</div>
              <div className="text-sm font-orbitron font-bold">{proyecto.Horas_Totales}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-cyan" />
            <div>
              <div className="text-xs text-text-secondary">Recursos</div>
              <div className="text-sm font-orbitron font-bold">{proyecto.Recursos}</div>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        {proyecto.Progreso !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Progreso</span>
              <span>{proyecto.Progreso}%</span>
            </div>
            <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${proyecto.Progreso}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

