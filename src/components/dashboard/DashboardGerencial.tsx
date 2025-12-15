import { motion } from 'framer-motion';
import { Briefcase, Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import { ExcelData } from '../../types';
import { formatDate, formatNumber } from '../../utils/formatters';
import { getProjectColor } from '../../utils/formatters';

interface DashboardGerencialProps {
  data: ExcelData;
}

export default function DashboardGerencial({ data }: DashboardGerencialProps) {
  const proyectos = data.proyectos || [];
  const recursos = data.recursos || [];
  const matriz = data.matriz || [];

  // Calcular ocupación de recursos por proyecto
  const ocupacionPorProyecto = proyectos.map(proyecto => {
    const proyectoMatriz = matriz.find(m => m.Proyecto === proyecto.Proyecto);
    const recursosAsignados = recursos.filter(recurso => {
      const horas = Number(proyectoMatriz?.[recurso.Recurso]) || 0;
      return horas > 0;
    });

    return {
      proyecto: proyecto.Proyecto,
      recursosAsignados: recursosAsignados.length,
      recursos: recursosAsignados.map(r => r.Recurso),
      horasTotales: proyecto.Horas_Totales || 0,
      fechaEntrega: proyecto.Entrega,
      fechaInicio: proyecto.Inicio,
      fechaFin: proyecto.Fin,
      estado: proyecto.Estado,
      prioridad: proyecto.Prioridad,
    };
  });

  // Calcular totales
  const totalProyectos = proyectos.length;
  const totalHoras = proyectos.reduce((sum, p) => sum + (p.Horas_Totales || 0), 0);
  const totalRecursos = recursos.length;

  return (
    <div className="space-y-8">
      {/* Header con resumen ejecutivo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary p-8 rounded-lg border-2 border-accent-cyan shadow-neon-cyan"
      >
        <h1 className="text-4xl font-orbitron font-bold text-accent-cyan mb-6 glow-text">
          INFORME GERENCIAL - PORTFOLIO DE PROYECTOS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-tertiary p-6 rounded-lg border-2 border-accent-cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-cyan/20 rounded-lg">
                <Briefcase className="w-8 h-8 text-accent-cyan" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-rajdhani uppercase">Total Proyectos</p>
                <p className="text-4xl font-orbitron font-bold text-text-primary">{totalProyectos}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-tertiary p-6 rounded-lg border-2 border-accent-cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-cyan/20 rounded-lg">
                <Clock className="w-8 h-8 text-accent-cyan" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-rajdhani uppercase">Horas Totales</p>
                <p className="text-4xl font-orbitron font-bold text-text-primary">{formatNumber(totalHoras)}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-tertiary p-6 rounded-lg border-2 border-accent-cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-cyan/20 rounded-lg">
                <Users className="w-8 h-8 text-accent-cyan" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-rajdhani uppercase">Recursos Totales</p>
                <p className="text-4xl font-orbitron font-bold text-text-primary">{totalRecursos}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabla detallada por proyecto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-bg-secondary rounded-lg border-2 border-accent-cyan shadow-neon-cyan overflow-hidden"
      >
        <div className="p-6 border-b-2 border-border-color">
          <h2 className="text-2xl font-rajdhani font-bold text-accent-cyan uppercase">
            Detalle por Proyecto
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-tertiary border-b-2 border-border-color">
                <th className="px-6 py-4 text-left font-rajdhani font-bold text-accent-cyan uppercase text-sm sticky left-0 bg-bg-tertiary z-10">
                  Proyecto
                </th>
                <th className="px-6 py-4 text-center font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Recursos Asignados
                </th>
                <th className="px-6 py-4 text-center font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Horas Totales
                </th>
                <th className="px-6 py-4 text-center font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Fecha Inicio
                </th>
                <th className="px-6 py-4 text-center font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Fecha Fin
                </th>
                <th className="px-6 py-4 text-center font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Fecha Entrega
                </th>
                <th className="px-6 py-4 text-center font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Estado
                </th>
                <th className="px-6 py-4 text-center font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Prioridad
                </th>
              </tr>
            </thead>
            <tbody>
              {ocupacionPorProyecto.map((item, index) => {
                const color = getProjectColor(item.proyecto);
                const isAtrasado = item.estado === 'Atrasado';
                const fechaEntrega = new Date(item.fechaEntrega);
                const hoy = new Date();
                const diasRestantes = Math.ceil((fechaEntrega.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <motion.tr
                    key={item.proyecto}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-border-color hover:bg-bg-tertiary transition-colors"
                  >
                    <td className="px-6 py-4 sticky left-0 bg-bg-secondary z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-1 h-12 rounded"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <p className="font-rajdhani font-bold text-text-primary text-lg">
                            {item.proyecto}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.recursos.slice(0, 3).map((recurso, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-accent-cyan/20 text-accent-cyan rounded font-rajdhani"
                              >
                                {recurso}
                              </span>
                            ))}
                            {item.recursos.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-accent-cyan/20 text-accent-cyan rounded font-rajdhani">
                                +{item.recursos.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-5 h-5 text-accent-cyan" />
                        <span className="font-orbitron font-bold text-text-primary">
                          {item.recursosAsignados}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 font-rajdhani">
                        de {totalRecursos} recursos
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5 text-accent-cyan" />
                        <span className="font-orbitron font-bold text-text-primary text-lg">
                          {formatNumber(item.horasTotales)}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 font-rajdhani">
                        horas
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-text-secondary" />
                        <span className="font-rajdhani text-text-primary">
                          {formatDate(item.fechaInicio)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-text-secondary" />
                        <span className="font-rajdhani text-text-primary">
                          {formatDate(item.fechaFin)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className={`w-4 h-4 ${isAtrasado ? 'text-accent-red' : diasRestantes < 7 ? 'text-accent-orange' : 'text-accent-green'}`} />
                          <span className={`font-rajdhani font-bold ${
                            isAtrasado ? 'text-accent-red' : diasRestantes < 7 ? 'text-accent-orange' : 'text-accent-green'
                          }`}>
                            {formatDate(item.fechaEntrega)}
                          </span>
                        </div>
                        {!isAtrasado && (
                          <span className={`text-xs font-rajdhani ${
                            diasRestantes < 7 ? 'text-accent-orange' : 'text-text-secondary'
                          }`}>
                            {diasRestantes > 0 ? `${diasRestantes} días restantes` : 'Vencido'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded text-xs font-rajdhani font-bold uppercase border ${
                          item.estado === 'Atrasado'
                            ? 'border-accent-red text-accent-red bg-accent-red/20'
                            : item.estado === 'En_Progreso'
                            ? 'border-accent-green text-accent-green bg-accent-green/20'
                            : 'border-accent-cyan text-accent-cyan bg-accent-cyan/20'
                        }`}
                      >
                        {item.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded text-xs font-rajdhani font-bold uppercase border ${
                          item.prioridad === 'Alta'
                            ? 'border-accent-red text-accent-red bg-accent-red/20'
                            : item.prioridad === 'Media'
                            ? 'border-accent-orange text-accent-orange bg-accent-orange/20'
                            : 'border-accent-cyan text-accent-cyan bg-accent-cyan/20'
                        }`}
                      >
                        {item.prioridad}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Resumen de ocupación de recursos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-bg-secondary p-6 rounded-lg border-2 border-accent-cyan shadow-neon-cyan"
      >
        <h2 className="text-2xl font-rajdhani font-bold text-accent-cyan mb-6 uppercase">
          Ocupación de Recursos por Proyecto
        </h2>
        
        <div className="space-y-4">
          {ocupacionPorProyecto.map((item, index) => {
            const porcentaje = (item.recursosAsignados / totalRecursos) * 100;
            const color = getProjectColor(item.proyecto);

            return (
              <motion.div
                key={item.proyecto}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-bg-tertiary p-4 rounded-lg border border-border-color"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-rajdhani font-bold text-text-primary">
                      {item.proyecto}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-secondary font-rajdhani">
                      {item.recursosAsignados} recursos
                    </span>
                    <span className="text-sm font-orbitron font-bold text-accent-cyan">
                      {porcentaje.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.recursos.map((recurso, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded border border-accent-cyan/30 font-rajdhani"
                    >
                      {recurso}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

