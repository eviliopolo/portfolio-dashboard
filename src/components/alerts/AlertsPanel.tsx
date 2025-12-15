import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import AlertCard from './AlertCard';
import { Recurso, Solapamiento, Proyecto } from '../../types';
import { formatPercentage } from '../../utils/formatters';

interface AlertsPanelProps {
  recursos: Recurso[];
  solapamientos: Solapamiento[];
  proyectos: Proyecto[];
}

export default function AlertsPanel({ recursos, solapamientos, proyectos }: AlertsPanelProps) {
  // Recursos críticos
  const recursosCriticos = recursos.filter(r => r.Estado === 'Critico' || r.Ocupacion > 100);

  // Solapamientos críticos
  const solapamientosCriticos = solapamientos.filter(s => s.Max_Concurrentes >= 6);

  // Proyectos en riesgo
  const proyectosAtrasados = proyectos.filter(p => p.Estado === 'Atrasado');

  const alerts = [
    ...recursosCriticos.map(r => ({
      type: 'recurso' as const,
      title: `Recurso Crítico: ${r.Recurso}`,
      description: `Ocupación: ${formatPercentage(r.Ocupacion)} - ${r.Tareas} tareas asignadas`,
      severity: r.Ocupacion > 110 ? 'critical' as const : 'warning' as const,
    })),
    ...solapamientosCriticos.map(s => ({
      type: 'solapamiento' as const,
      title: `Solapamiento Crítico: ${s.Recurso}`,
      description: `${s.Max_Concurrentes} tareas concurrentes - ${s.Tareas} tareas totales`,
      severity: 'critical' as const,
    })),
    ...proyectosAtrasados.map(p => ({
      type: 'proyecto' as const,
      title: `Proyecto Atrasado: ${p.Proyecto}`,
      description: `Entrega: ${p.Entrega} - ${p.Tareas} tareas pendientes`,
      severity: 'warning' as const,
    })),
  ];

  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-bg-secondary p-6 rounded-lg border-2 border-accent-green shadow-neon-green"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-green/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-accent-green" />
          </div>
          <div>
            <h3 className="font-rajdhani font-bold text-accent-green text-lg">
              Sin Alertas Críticas
            </h3>
            <p className="text-text-secondary text-sm">
              Todos los indicadores están dentro de los parámetros normales
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-accent-red" />
        <h2 className="text-2xl font-rajdhani font-bold text-accent-red">
          Alertas Críticas ({alerts.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert, index) => (
          <AlertCard
            key={index}
            type={alert.type}
            title={alert.title}
            description={alert.description}
            severity={alert.severity}
          />
        ))}
      </div>
    </motion.div>
  );
}

