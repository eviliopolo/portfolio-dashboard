import { motion } from 'framer-motion';
import { Briefcase, Calendar, Clock, Users } from 'lucide-react';
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

    // Validar y convertir Horas_Totales
    let horasTotales = 0;
    if (typeof proyecto.Horas_Totales === 'number') {
      horasTotales = (proyecto.Horas_Totales > 0 && proyecto.Horas_Totales < 1000000) 
        ? proyecto.Horas_Totales 
        : 0;
    } else if (typeof proyecto.Horas_Totales === 'string') {
      const horasString: string = proyecto.Horas_Totales;
      const parsed = parseFloat(horasString.replace(/[^\d.-]/g, ''));
      horasTotales = isNaN(parsed) ? 0 : (parsed > 0 && parsed < 1000000 ? parsed : 0);
    }

    return {
      proyecto: proyecto.Proyecto,
      recursosAsignados: recursosAsignados.length,
      recursos: recursosAsignados.map(r => r.Recurso),
      horasTotales: horasTotales,
      fechaEntrega: proyecto.Entrega,
      fechaInicio: proyecto.Inicio,
      fechaFin: proyecto.Fin,
      estado: proyecto.Estado,
      prioridad: proyecto.Prioridad,
    };
  });

  // Calcular totales
  const totalProyectos = proyectos.length;
  const totalHoras = ocupacionPorProyecto.reduce((sum, p) => sum + (p.horasTotales || 0), 0);
  const totalRecursos = recursos.length;

  return (
    <div className="space-y-8">
      {/* Header con resumen ejecutivo */}
      <div>
        <h1 className="text-2xl font-sans font-semibold text-text-primary mb-1 tracking-tight">
          Portfolio de Proyectos
        </h1>
        <p className="text-sm text-text-muted mb-8">Resumen ejecutivo</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-card p-8 rounded-xl border-2 border-border-color shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">Total Proyectos</p>
                <p className="text-3xl font-sans font-bold text-text-primary">{totalProyectos}</p>
              </div>
              <div className="p-3 bg-bg-tertiary rounded-lg border border-border-light">
                <Briefcase className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-bg-card p-8 rounded-xl border-2 border-border-color shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">Horas Totales</p>
                <p className="text-3xl font-sans font-bold text-text-primary">{formatNumber(totalHoras)}</p>
              </div>
              <div className="p-3 bg-bg-tertiary rounded-lg border border-border-light">
                <Clock className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-bg-card p-8 rounded-xl border-2 border-border-color shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">Recursos Totales</p>
                <p className="text-3xl font-sans font-bold text-text-primary">{totalRecursos}</p>
              </div>
              <div className="p-3 bg-bg-tertiary rounded-lg border border-border-light">
                <Users className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla detallada por proyecto */}
      <div className="bg-bg-secondary rounded-xl border-2 border-border-color shadow-elegant overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-border-light">
          <h2 className="text-lg font-sans font-semibold text-text-primary">
            Detalle por Proyecto
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-color">
                <th className="px-6 py-3 text-left font-sans font-medium text-text-secondary text-xs uppercase tracking-wider sticky left-0 bg-bg-tertiary z-10">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-center font-sans font-medium text-text-secondary text-xs uppercase tracking-wider">
                  Recursos
                </th>
                <th className="px-6 py-3 text-center font-sans font-medium text-text-secondary text-xs uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-6 py-3 text-center font-sans font-medium text-text-secondary text-xs uppercase tracking-wider">
                  Inicio
                </th>
                <th className="px-6 py-3 text-center font-sans font-medium text-text-secondary text-xs uppercase tracking-wider">
                  Fin
                </th>
                <th className="px-6 py-3 text-center font-sans font-medium text-text-secondary text-xs uppercase tracking-wider">
                  Entrega
                </th>
                <th className="px-6 py-3 text-center font-sans font-medium text-text-secondary text-xs uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center font-sans font-medium text-text-secondary text-xs uppercase tracking-wider">
                  Prioridad
                </th>
              </tr>
            </thead>
            <tbody>
              {ocupacionPorProyecto.map((item, index) => {
                const color = getProjectColor(item.proyecto);
                const isAtrasado = item.estado === 'Atrasado';
                const fechaEntrega = item.fechaEntrega ? new Date(item.fechaEntrega) : null;
                const hoy = new Date();
                const diasRestantes = fechaEntrega && !isNaN(fechaEntrega.getTime())
                  ? Math.ceil((fechaEntrega.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <motion.tr
                    key={item.proyecto}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-border-color hover:bg-bg-tertiary/30 transition-colors"
                  >
                    <td className="px-6 py-4 sticky left-0 bg-bg-secondary z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-1 h-12 rounded"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <p className="font-sans font-medium text-text-primary text-sm mb-1">
                            {item.proyecto}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {item.recursos.slice(0, 2).map((recurso, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 bg-bg-tertiary text-text-muted rounded font-sans"
                              >
                                {recurso}
                              </span>
                            ))}
                            {item.recursos.length > 2 && (
                              <span className="text-xs px-2 py-0.5 bg-bg-tertiary text-text-muted rounded font-sans">
                                +{item.recursos.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-sans font-medium text-text-primary text-sm">
                        {item.recursosAsignados}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-sans font-medium text-text-primary text-sm">
                        {formatNumber(item.horasTotales)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-sans text-text-secondary text-sm">
                        {formatDate(item.fechaInicio)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-sans text-text-secondary text-sm">
                        {formatDate(item.fechaFin)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-sans text-sm ${
                        isAtrasado ? 'text-text-primary font-semibold' : 'text-text-secondary'
                      }`}>
                        {formatDate(item.fechaEntrega)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-sans font-medium ${
                          item.estado === 'Atrasado'
                            ? 'text-red-700 bg-red-50 border-red-300'
                            : item.estado === 'En_Progreso'
                            ? 'text-blue-700 bg-blue-50 border-blue-300'
                            : 'text-gray-600 bg-gray-50 border-gray-300'
                        }`}
                      >
                        {item.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-sans font-medium ${
                          item.prioridad === 'Alta'
                            ? 'text-orange-700 bg-orange-50 border-orange-300'
                            : item.prioridad === 'Media'
                            ? 'text-yellow-700 bg-yellow-50 border-yellow-300'
                            : 'text-green-700 bg-green-50 border-green-300'
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
      </div>

      {/* Resumen de ocupación de recursos */}
      <div className="bg-bg-secondary p-8 rounded-xl border-2 border-border-color shadow-elegant">
        <h2 className="text-lg font-sans font-semibold text-text-primary mb-6">
          Ocupación de Recursos por Proyecto
        </h2>
        
        <div className="space-y-3">
          {ocupacionPorProyecto.map((item, index) => {
            const porcentaje = (item.recursosAsignados / totalRecursos) * 100;

            return (
              <div
                key={item.proyecto}
                className="bg-bg-card p-6 rounded-lg border-2 border-border-color"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans font-medium text-text-primary text-sm">
                    {item.proyecto}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted font-sans">
                      {item.recursosAsignados} recursos
                    </span>
                    <span className="text-sm font-sans font-semibold text-text-primary">
                      {porcentaje.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    className="h-full rounded-full bg-text-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
