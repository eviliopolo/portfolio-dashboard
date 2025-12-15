import { useState } from 'react';
import { motion } from 'framer-motion';
import { MatrizHoras } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface HeatmapMatrixProps {
  matriz: MatrizHoras[];
}

export default function HeatmapMatrix({ matriz }: HeatmapMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{ proyecto: string; recurso: string; horas: number } | null>(null);

  // Extraer proyectos y recursos únicos
  const proyectos = Array.from(new Set(matriz.map(m => m.Proyecto)));
  const recursos = matriz.length > 0 
    ? Object.keys(matriz[0]).filter(key => key !== 'Proyecto')
    : [];

  // Función para obtener el color según las horas
  const getHeatColor = (horas: number, maxHoras: number) => {
    if (horas === 0) return 'bg-bg-tertiary';
    const intensity = horas / maxHoras;
    if (intensity > 0.8) return 'bg-accent-red';
    if (intensity > 0.6) return 'bg-accent-orange';
    if (intensity > 0.4) return 'bg-accent-cyan';
    if (intensity > 0.2) return 'bg-accent-green';
    return 'bg-accent-green/50';
  };

  // Calcular máximo de horas para normalizar colores
  const maxHoras = Math.max(
    ...matriz.flatMap(m => 
      recursos.map(r => Number(m[r]) || 0)
    )
  );

  // Calcular totales
  const totalesPorProyecto = proyectos.map(proyecto => {
    const proyectoData = matriz.find(m => m.Proyecto === proyecto);
    return recursos.reduce((sum, r) => sum + (Number(proyectoData?.[r]) || 0), 0);
  });

  const totalesPorRecurso = recursos.map(recurso => {
    return matriz.reduce((sum, m) => sum + (Number(m[recurso]) || 0), 0);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary p-6 rounded-lg border-2 border-accent-cyan shadow-neon-cyan"
    >
      <h3 className="text-xl font-rajdhani font-bold text-accent-cyan mb-6 uppercase">
        Matriz de Horas: Proyectos × Recursos
      </h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-rajdhani font-bold text-accent-cyan border border-border-color bg-bg-tertiary sticky left-0 z-10">
                  Proyecto
                </th>
                {recursos.map((recurso) => (
                  <th
                    key={recurso}
                    className="px-4 py-3 text-center font-rajdhani font-bold text-accent-cyan border border-border-color bg-bg-tertiary min-w-[100px]"
                  >
                    {recurso}
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-rajdhani font-bold text-accent-cyan border border-border-color bg-bg-tertiary">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto, pIndex) => {
                const proyectoData = matriz.find(m => m.Proyecto === proyecto);
                return (
                  <tr key={proyecto}>
                    <td className="px-4 py-3 font-rajdhani font-semibold text-text-primary border border-border-color bg-bg-tertiary sticky left-0 z-10">
                      {proyecto}
                    </td>
                    {recursos.map((recurso) => {
                      const horas = Number(proyectoData?.[recurso]) || 0;
                      return (
                        <td
                          key={`${proyecto}-${recurso}`}
                          className={`px-4 py-3 text-center border border-border-color cursor-pointer transition-all ${
                            getHeatColor(horas, maxHoras)
                          } ${
                            hoveredCell?.proyecto === proyecto && hoveredCell?.recurso === recurso
                              ? 'ring-2 ring-accent-cyan scale-105'
                              : 'hover:brightness-110'
                          }`}
                          onMouseEnter={() => setHoveredCell({ proyecto, recurso, horas })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <span className="font-orbitron text-sm text-text-primary">
                            {horas > 0 ? formatNumber(horas) : '-'}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center font-orbitron font-bold text-accent-cyan border border-border-color bg-bg-tertiary">
                      {formatNumber(totalesPorProyecto[pIndex])}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-bg-tertiary">
                <td className="px-4 py-3 font-rajdhani font-bold text-accent-cyan border border-border-color sticky left-0 z-10">
                  Total
                </td>
                {totalesPorRecurso.map((total, index) => (
                  <td
                    key={`total-${index}`}
                    className="px-4 py-3 text-center font-orbitron font-bold text-accent-cyan border border-border-color"
                  >
                    {formatNumber(total)}
                  </td>
                ))}
                <td className="px-4 py-3 text-center font-orbitron font-bold text-accent-cyan border border-border-color">
                  {formatNumber(totalesPorRecurso.reduce((a, b) => a + b, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-bg-tertiary border-2 border-accent-cyan rounded-lg"
        >
          <p className="font-rajdhani text-text-primary">
            <span className="text-accent-cyan font-bold">{hoveredCell.proyecto}</span>
            {' × '}
            <span className="text-accent-cyan font-bold">{hoveredCell.recurso}</span>
          </p>
          <p className="font-orbitron text-2xl text-accent-cyan mt-2">
            {formatNumber(hoveredCell.horas)} horas
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

