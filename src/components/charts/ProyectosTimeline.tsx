import { motion } from 'framer-motion';
import { getProjectColor } from '../../utils/formatters';
import { Calendar } from 'lucide-react';

// DATOS FIJOS DE LOS 12 PROYECTOS
const PROYECTOS_TIMELINE = [
  { id: 1, nombre: "XTAM VMS - XTAM EDGE - Sirena", inicio: "2025-12-11", fin: "2026-01-29" },
  { id: 2, nombre: "Informe Mensual", inicio: "2025-12-11", fin: "2025-12-26" },
  { id: 3, nombre: "Otros Prioritarios - Inventarios subsistemas", inicio: "2025-12-11", fin: "2025-12-19" },
  { id: 4, nombre: "Otros Prioritarios - Dashboard de proyectos - Xtam Cali", inicio: "2025-12-11", fin: "2025-12-19" },
  { id: 5, nombre: "Otros Prioritarios - Dashboard de proyectos - Acueducto", inicio: "2025-12-11", fin: "2025-12-26" },
  { id: 6, nombre: "Otros Prioritarios - Configuración GLPI", inicio: "2025-12-11", fin: "2025-12-19" },
  { id: 7, nombre: "Otros Prioritarios - Capacitación NOC", inicio: "2025-12-11", fin: "2025-12-19" },
  { id: 8, nombre: "Chatbot", inicio: "2025-12-29", fin: "2026-01-20" },
  { id: 9, nombre: "Ceres", inicio: "2026-01-12", fin: "2026-01-30" },
  { id: 10, nombre: "ONVIF", inicio: "2026-01-16", fin: "2026-02-07" },
  { id: 11, nombre: "Control de Asistencia", inicio: "2025-12-19", fin: "2026-01-30" },
  { id: 12, nombre: "XTAM NOC Integrado manttoGuard", inicio: "2026-01-05", fin: "2026-01-30" }
];

export default function ProyectosTimeline() {
  const proyectosConFechas = PROYECTOS_TIMELINE;

  // Encontrar la fecha mínima y máxima - CORREGIR ZONA HORARIA
  const fechas = proyectosConFechas.flatMap(p => {
    // Crear fechas sin conversión de zona horaria
    const [yInicio, mInicio, dInicio] = p.inicio.split('-').map(Number);
    const [yFin, mFin, dFin] = p.fin.split('-').map(Number);
    return [
      new Date(yInicio, mInicio - 1, dInicio, 12, 0, 0, 0),
      new Date(yFin, mFin - 1, dFin, 12, 0, 0, 0)
    ];
  });
  
  const fechaMin = new Date(Math.min(...fechas.map(f => f.getTime())));
  const fechaMax = new Date(Math.max(...fechas.map(f => f.getTime())));

  // Agregar margen a las fechas
  const margenDias = 2;
  fechaMin.setDate(fechaMin.getDate() - margenDias);
  fechaMax.setDate(fechaMax.getDate() + margenDias);
  
  console.log('📅 Rango de Timeline:', {
    min: fechaMin.toLocaleDateString('es-ES'),
    max: fechaMax.toLocaleDateString('es-ES'),
    totalDias: Math.ceil((fechaMax.getTime() - fechaMin.getTime()) / (1000 * 60 * 60 * 24))
  });

  const rangoTotal = fechaMax.getTime() - fechaMin.getTime();

  // Función para calcular la posición y ancho de la barra
  // SIN CONVERSIÓN DE ZONA HORARIA - usar las fechas tal cual
  const calcularPosicion = (inicio: string, fin: string) => {
    const [yInicio, mInicio, dInicio] = inicio.split('-').map(Number);
    const [yFin, mFin, dFin] = fin.split('-').map(Number);
    
    const fechaInicio = new Date(yInicio, mInicio - 1, dInicio, 12, 0, 0, 0);
    const fechaFin = new Date(yFin, mFin - 1, dFin, 12, 0, 0, 0);
    
    const posInicio = ((fechaInicio.getTime() - fechaMin.getTime()) / rangoTotal) * 100;
    const posFin = ((fechaFin.getTime() - fechaMin.getTime()) / rangoTotal) * 100;
    
    return {
      left: `${posInicio}%`,
      width: `${posFin - posInicio}%`
    };
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Generar marcadores de tiempo (cada 7 días para mayor densidad)
  const generarMarcadores = () => {
    const marcadores: Date[] = [];
    const actual = new Date(fechaMin.getFullYear(), fechaMin.getMonth(), fechaMin.getDate(), 12, 0, 0, 0);
    
    while (actual <= fechaMax) {
      marcadores.push(new Date(actual));
      actual.setDate(actual.getDate() + 7); // Cada 7 días
    }
    
    return marcadores;
  };

  const marcadoresTiempo = generarMarcadores();
  
  console.log('📌 Marcadores generados:', marcadoresTiempo.length, 
    'primero:', marcadoresTiempo[0]?.toLocaleDateString('es-ES'),
    'último:', marcadoresTiempo[marcadoresTiempo.length - 1]?.toLocaleDateString('es-ES'));

  // Ordenar proyectos por fecha de inicio
  const proyectosOrdenados = [...proyectosConFechas].sort((a, b) => 
    new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
  );

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-border-color shadow-elegant">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-text-primary" />
            <h2 className="text-base font-sans font-semibold text-text-primary">
              Línea de Tiempo de Proyectos
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-text-muted">
              {formatearFecha(fechaMin.toISOString())} → {formatearFecha(fechaMax.toISOString())}
            </p>
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1 rounded-md">
              <div className="w-1 h-4 bg-red-600 rounded" />
              <span className="text-xs font-semibold text-red-700">
                Hoy: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Container - Sistema unificado de coordenadas */}
      <div className="relative flex">
        {/* Columna de nombres - FIJA */}
        <div className="w-80 flex-shrink-0" />
        
        {/* Área del timeline - ALINEADA */}
        <div className="flex-1 relative">
          {/* Escala de tiempo superior - ORIGEN X=0 */}
          <div className="relative h-8 mb-4 border-b border-gray-300">
            {marcadoresTiempo.map((fecha, idx) => {
              const pos = ((fecha.getTime() - fechaMin.getTime()) / rangoTotal) * 100;
              const esInicioMes = fecha.getDate() <= 7;
              return (
                <div
                  key={idx}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className={`w-px ${esInicioMes ? 'h-4 bg-gray-400' : 'h-2 bg-gray-300'}`} />
                  <span className={`text-[10px] mt-0.5 whitespace-nowrap ${esInicioMes ? 'font-semibold text-gray-700' : 'text-gray-500'}`}>
                    {fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="relative">


        {/* Proyectos - Más compactos */}
        <div className="space-y-1">
          {proyectosOrdenados.map((proyecto, index) => {
            const color = getProjectColor(proyecto.nombre);
            const posicion = calcularPosicion(proyecto.inicio, proyecto.fin);
            const duracionDias = Math.ceil(
              (new Date(proyecto.fin).getTime() - new Date(proyecto.inicio).getTime()) / 
              (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div
                key={proyecto.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="relative h-10 group flex"
              >
                {/* Columna de nombres - FIJA (alineada con header) */}
                <div className="w-80 flex-shrink-0 pr-3 flex items-center">
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="w-1 h-6 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-medium text-text-primary leading-tight truncate">
                        {proyecto.nombre}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Área del timeline - ALINEADA CON EJE X */}
                <div className="flex-1 relative flex items-center">
                  {/* Línea de fondo sutil */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2" />
                  
                  {/* Barra del proyecto - MISMO ORIGEN QUE EJE X */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ ...posicion }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="absolute top-1/2 -translate-y-1/2 h-5 rounded shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    style={{ 
                      backgroundColor: color,
                      ...posicion
                    }}
                    title={`${proyecto.nombre}\n${formatearFecha(proyecto.inicio)} → ${formatearFecha(proyecto.fin)}\n${duracionDias} días`}
                  >
                    {/* Borde sutil */}
                    <div className="absolute inset-0 border border-white/20 rounded" />
                    
                    {/* Tooltip al hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
                        <div className="font-semibold mb-1">{proyecto.nombre}</div>
                        <div className="text-gray-300">
                          {formatearFecha(proyecto.inicio)} → {formatearFecha(proyecto.fin)}
                        </div>
                        <div className="text-gray-400 text-[10px] mt-0.5">
                          {duracionDias} día{duracionDias !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Línea de "hoy" - DENTRO DEL ÁREA DE TIMELINE */}
        <div className="absolute inset-0 flex pointer-events-none">
          {/* Espaciador para columna de nombres */}
          <div className="w-80 flex-shrink-0" />
          
          {/* Área de timeline con línea HOY */}
          <div className="flex-1 relative">
            {(() => {
              // FECHA ACTUAL DEL SISTEMA - sin modificaciones
              const ahora = new Date();
              const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 12, 0, 0, 0);
              
              console.log('🕒 DEBUG Timeline - Fecha actual del sistema:', {
                sistemaCompleta: ahora.toLocaleString('es-ES'),
                hoySinHora: hoy.toLocaleDateString('es-ES'),
                horaActual: ahora.toLocaleTimeString('es-ES'),
                timestamp: hoy.getTime(),
                fechaMin: fechaMin.toLocaleDateString('es-ES'),
                fechaMax: fechaMax.toLocaleDateString('es-ES')
              });
              
              if (hoy >= fechaMin && hoy <= fechaMax) {
                const posHoy = ((hoy.getTime() - fechaMin.getTime()) / rangoTotal) * 100;
                
                console.log('📍 Posición de HOY:', {
                  porcentaje: posHoy.toFixed(2) + '%',
                  fecha: hoy.toLocaleDateString('es-ES'),
                  alineacion: 'Misma posición que barras y eje X'
                });
                
                return (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-600 z-20 pointer-events-auto"
                    style={{ left: `${posHoy}%` }}
                  >
                    {/* Etiqueta HOY con fecha completa - ENCIMA del eje X */}
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-red-600 text-white px-3 py-1.5 rounded-md shadow-lg border-2 border-red-700">
                        <div className="text-[10px] font-bold uppercase tracking-wide">HOY</div>
                        <div className="text-xs font-semibold">
                          {hoy.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Tooltip hover con información adicional */}
                    <div className="absolute top-1/2 left-2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-xl text-xs whitespace-nowrap">
                        <div className="font-bold mb-1">
                          {ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="text-gray-400 text-[10px]">
                          Hora: {ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              console.log('⚠️ HOY está fuera del rango de la timeline');
              return null;
            })()}
          </div>
        </div>
      </div>

      {/* Leyenda inferior compacta */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-red-500" />
            <span>Fecha actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-3 rounded shadow-sm bg-gradient-to-r from-blue-500 to-purple-500" />
            <span>Duración del proyecto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">💡 Hover:</span>
            <span className="text-gray-500">Ver detalles del proyecto</span>
          </div>
        </div>
      </div>
    </div>
  );
}

