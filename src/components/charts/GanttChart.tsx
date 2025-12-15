import { useState } from 'react';
import { motion } from 'framer-motion';
import { TimelineData } from '../../types';
import { formatDate } from '../../utils/formatters';
import { differenceInDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface GanttChartProps {
  timeline: TimelineData[];
}

export default function GanttChart({ timeline }: GanttChartProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Calcular rango de fechas
  const allDates = timeline.flatMap(t => [
    parseISO(t.Inicio),
    parseISO(t.Fin)
  ]).filter(d => !isNaN(d.getTime()));

  const minDate = allDates.length > 0 
    ? startOfMonth(new Date(Math.min(...allDates.map(d => d.getTime()))))
    : new Date();
  const maxDate = allDates.length > 0
    ? endOfMonth(new Date(Math.max(...allDates.map(d => d.getTime()))))
    : new Date();

  const totalDays = differenceInDays(maxDate, minDate) + 1;
  const days = eachDayOfInterval({ start: minDate, end: maxDate });

  // Agrupar por proyecto
  const proyectos = Array.from(new Set(timeline.map(t => t.Proyecto)));
  const filteredTimeline = selectedProject
    ? timeline.filter(t => t.Proyecto === selectedProject)
    : timeline;

  const getTaskPosition = (inicio: string, fin: string) => {
    const start = parseISO(inicio);
    const end = parseISO(fin);
    const startOffset = differenceInDays(start, minDate);
    const duration = differenceInDays(end, start) + 1;
    const leftPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;
    return { leftPercent, widthPercent };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary p-6 rounded-lg border-2 border-accent-cyan shadow-neon-cyan"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-rajdhani font-bold text-accent-cyan uppercase">
          Timeline / Gantt Chart
        </h3>
        <select
          value={selectedProject || 'all'}
          onChange={(e) => setSelectedProject(e.target.value === 'all' ? null : e.target.value)}
          className="px-4 py-2 bg-bg-tertiary border-2 border-border-color rounded-lg 
                   text-text-primary focus:border-accent-cyan focus:outline-none font-rajdhani"
        >
          <option value="all">Todos los proyectos</option>
          {proyectos.map((proyecto) => (
            <option key={proyecto} value={proyecto}>{proyecto}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] relative">
          {/* Header con fechas */}
          <div className="flex border-b-2 border-border-color mb-4 relative">
            <div className="w-48 flex-shrink-0 p-2 font-rajdhani font-bold text-accent-cyan border-r-2 border-border-color">
              Tarea / Proyecto
            </div>
            <div className="flex-1 relative">
              {days.map((day, index) => {
                const isFirstOfMonth = day.getDate() === 1;
                return (
                  <div
                    key={index}
                    className={`absolute top-0 h-full border-r border-border-color ${
                      isFirstOfMonth ? 'border-r-2' : ''
                    }`}
                    style={{ left: `${(index / totalDays) * 100}%`, width: `${(1 / totalDays) * 100}%` }}
                  >
                    {isFirstOfMonth && (
                      <div className="absolute -top-6 left-0 text-xs text-text-secondary font-rajdhani">
                        {day.toLocaleDateString('es-ES', { month: 'short' })}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Línea de "hoy" en el header */}
              {minDate <= new Date() && new Date() <= maxDate && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-accent-green z-10"
                  style={{
                    left: `${((differenceInDays(new Date(), minDate) / totalDays) * 100)}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 text-xs text-accent-green font-rajdhani font-bold whitespace-nowrap">
                    HOY
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Barras de tareas */}
          <div className="space-y-2 relative">
            {proyectos.map((proyecto) => {
              const proyectoTasks = filteredTimeline.filter(t => t.Proyecto === proyecto);
              if (proyectoTasks.length === 0) return null;

              return (
                <div key={proyecto} className="mb-4">
                  <div className="font-rajdhani font-bold text-accent-cyan mb-2">
                    {proyecto}
                  </div>
                  {proyectoTasks.map((task, index) => {
                    const { leftPercent, widthPercent } = getTaskPosition(task.Inicio, task.Fin);
                    return (
                      <div
                        key={index}
                        className="relative h-8 mb-1"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercent}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="absolute h-full rounded flex items-center px-2"
                          style={{
                            left: `${leftPercent}%`,
                            backgroundColor: task.Color || '#00d2ff',
                            boxShadow: `0 0 10px ${task.Color || '#00d2ff'}80`,
                          }}
                        >
                          <span className="text-xs font-rajdhani font-bold text-text-primary truncate">
                            {task.Tarea}
                          </span>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* Línea de "hoy" en las tareas */}
            {minDate <= new Date() && new Date() <= maxDate && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-accent-green z-10 pointer-events-none"
                style={{
                  left: `${((differenceInDays(new Date(), minDate) / totalDays) * 100)}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

