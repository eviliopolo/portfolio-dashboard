import { motion } from 'framer-motion';
import { Briefcase, Clock, Users, AlertTriangle, Download, Copy } from 'lucide-react';
import { ExcelData } from '../../types';
import { formatDate, formatNumber } from '../../utils/formatters';
import { getProjectColor } from '../../utils/formatters';
import CapacityCard from '../analytics/CapacityCard';
import PersonaCapacityCard from '../recursos/PersonaCapacityCard';
import RecursosBarChart from '../charts/RecursosBarChart';
import ProyectosTimeline from '../charts/ProyectosTimeline';
import { generarJSONRecursos, descargarJSON, copiarJSONAlPortapapeles } from '../../utils/exportJSON';
import { useState } from 'react';

interface DashboardGerencialProps {
  data: ExcelData;
}

export default function DashboardGerencial({ data }: DashboardGerencialProps) {
  const proyectos = data.proyectos || [];
  const recursos = data.recursos || [];
  const matriz = data.matriz || [];
  const capacidadEquipo = data.capacidadEquipo;
  const recursosCapacidad = data.recursosCapacidad || [];
  const [copiado, setCopiado] = useState(false);

  // Ordenar recursos: primero sobrecargados, luego equilibrio, luego disponibles
  const recursosOrdenados = [...recursosCapacidad].sort((a, b) => {
    const prioridad = {
      'sobrecargado': 1,
      'equilibrio': 2,
      'disponible': 3
    };
    return (prioridad[a.estado] || 99) - (prioridad[b.estado] || 99);
  });

  const handleDescargarJSON = () => {
    if (recursosCapacidad.length > 0) {
      const jsonData = generarJSONRecursos(recursosCapacidad);
      const fecha = new Date().toISOString().split('T')[0];
      descargarJSON(jsonData, `recursos-proyectos-${fecha}.json`);
    }
  };

  const handleCopiarJSON = async () => {
    if (recursosCapacidad.length > 0) {
      const jsonData = generarJSONRecursos(recursosCapacidad);
      try {
        await copiarJSONAlPortapapeles(jsonData);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      } catch (error) {
        console.error('Error copiando al portapapeles:', error);
      }
    }
  };

  // DEBUG temporal
  console.log('DEBUG - Datos de capacidadEquipo:', capacidadEquipo);
  console.log('DEBUG - Proyectos con estado/prioridad:', proyectos.map(p => ({ 
    proyecto: p.Proyecto, 
    estado: p.Estado, 
    prioridad: p.Prioridad 
  })));

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

  // Calcular totales y métricas de criticidad
  const totalRecursos = recursos.length;

  // Análisis de criticidad
  const proyectosCriticos = proyectos.filter(p => 
    p.Estado === 'Atrasado' || 
    p.Prioridad === 'Critico' ||
    p.Prioridad === 'Crítico'
  ).length;
  const proyectosAlto = proyectos.filter(p => p.Prioridad === 'Alta').length;
  
  // Calcular proyectos próximos a vencer (30 días)
  const hoy = new Date();
  const proximasEntregas = proyectos.filter(proyecto => {
    if (!proyecto.Entrega) return false;
    const fechaEntrega = new Date(proyecto.Entrega);
    const diasRestantes = Math.ceil((fechaEntrega.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes >= 0 && diasRestantes <= 30;
  }).length;

  const recursosSobrecargados = recursos.filter(r => r.Ocupacion > 100).length;

  // Ordenar ocupación por proyecto por criticidad
  const ocupacionOrdenada = ocupacionPorProyecto.sort((a, b) => {
    // Orden de prioridad: Crítico/Atrasado > Alta prioridad > En_Progreso > Otros
    const getPrioridadScore = (item: any) => {
      if (item.estado === 'Atrasado' || item.prioridad === 'Critico' || item.prioridad === 'Crítico') return 4;
      if (item.prioridad === 'Alta') return 3;
      if (item.estado === 'En_Progreso') return 2;
      return 1;
    };
    return getPrioridadScore(b) - getPrioridadScore(a);
  });

  return (
    <div className="space-y-8">
      {/* Header con resumen ejecutivo */}
      <div>
        <h1 className="text-2xl font-sans font-semibold text-text-primary mb-1 tracking-tight">
          Portfolio de Proyectos
        </h1>
        <p className="text-sm text-text-muted mb-8">Resumen ejecutivo</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Proyectos Críticos */}
          <div className="bg-white p-6 rounded-xl border-2 border-border-color shadow-elegant relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
            <div className="pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">Críticos</p>
                  <p className="text-3xl font-sans font-bold text-text-primary">{proyectosCriticos}</p>
                  <p className="text-xs text-text-muted mt-1">Atrasados</p>
                </div>
                <div className="p-2 bg-bg-tertiary rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Proyectos Alta Prioridad */}
          <div className="bg-white p-6 rounded-xl border-2 border-border-color shadow-elegant relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl"></div>
            <div className="pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">Alta Prioridad</p>
                  <p className="text-3xl font-sans font-bold text-text-primary">{proyectosAlto}</p>
                  <p className="text-xs text-text-muted mt-1">Requieren atención</p>
                </div>
                <div className="p-2 bg-bg-tertiary rounded-lg">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Entregas Próximas */}
          <div className="bg-white p-6 rounded-xl border-2 border-border-color shadow-elegant relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
            <div className="pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">Entregas 30 días</p>
                  <p className="text-3xl font-sans font-bold text-text-primary">{proximasEntregas}</p>
                  <p className="text-xs text-text-muted mt-1">Próximas</p>
                </div>
                <div className="p-2 bg-bg-tertiary rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recursos Sobrecargados */}
          <div className="bg-white p-6 rounded-xl border-2 border-border-color shadow-elegant relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-xl"></div>
            <div className="pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">Recursos Críticos</p>
                  <p className="text-3xl font-sans font-bold text-text-primary">{recursosSobrecargados}</p>
                  <p className="text-xs text-text-muted mt-1">Sobrecargados</p>
                </div>
                <div className="p-2 bg-bg-tertiary rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
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
              {ocupacionOrdenada.map((item, index) => {
                const color = getProjectColor(item.proyecto);
                const isAtrasado = item.estado === 'Atrasado';
                const isCritico = item.prioridad === 'Critico' || item.prioridad === 'Crítico';

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
                        isAtrasado || isCritico ? 'text-text-primary font-semibold' : 'text-text-secondary'
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
                          item.prioridad === 'Critico' || item.prioridad === 'Crítico'
                            ? 'text-red-700 bg-red-50 border-red-300'
                            : item.prioridad === 'Alta'
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

      {/* Card de Capacidad vs Demanda */}
      {capacidadEquipo ? (
        <CapacityCard capacidadEquipo={capacidadEquipo} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ No se encontraron datos de capacidad. Verificar que las hojas "Horas" (columna I) y "Matriz_Horas" contengan los totales.
          </p>
        </div>
      )}

      {/* Resumen de ocupación de recursos */}
      <div className="bg-bg-secondary p-8 rounded-xl border-2 border-border-color shadow-elegant">
        <h2 className="text-lg font-sans font-semibold text-text-primary mb-6">
          Ocupación de Recursos por Proyecto
        </h2>
        
        <div className="space-y-3">
          {ocupacionOrdenada.map((item, index) => {
            const porcentaje = totalRecursos > 0 ? (item.recursosAsignados / totalRecursos) * 100 : 0;

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

      {/* Gráfica de Barras Horizontales de Recursos */}
      {recursosCapacidad && recursosCapacidad.length > 0 && (
        <RecursosBarChart recursos={recursosCapacidad} />
      )}

      {/* Capacidad por Persona */}
      {recursosCapacidad && recursosCapacidad.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-sans font-semibold text-text-primary">
              Capacidad por Colaborador
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleCopiarJSON}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-border-color rounded-lg hover:bg-bg-secondary transition-colors shadow-sm"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {copiado ? '¡Copiado!' : 'Copiar JSON'}
                </span>
              </button>
              <button
                onClick={handleDescargarJSON}
                className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Descargar JSON</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recursosOrdenados.map((recurso, index) => (
              <PersonaCapacityCard 
                key={recurso.nombre} 
                recurso={recurso} 
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Timeline de Proyectos */}
      <ProyectosTimeline />

    </div>
  );
}
