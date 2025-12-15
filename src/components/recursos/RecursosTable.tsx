import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle } from 'lucide-react';
import { Recurso } from '../../types';
import { formatPercentage, getStatusColor } from '../../utils/formatters';
import { clsx } from 'clsx';

interface RecursosTableProps {
  recursos: Recurso[];
}

export default function RecursosTable({ recursos }: RecursosTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');

  const filteredRecursos = recursos.filter((recurso) => {
    const matchesSearch = recurso.Recurso.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'all' || recurso.Estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const estados = Array.from(new Set(recursos.map(r => r.Estado)));

  const getOcupacionColor = (ocupacion: number) => {
    if (ocupacion > 110) return 'bg-accent-red';
    if (ocupacion >= 100) return 'bg-accent-orange';
    if (ocupacion >= 85) return 'bg-accent-cyan';
    return 'bg-accent-green';
  };

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar recurso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-secondary border-2 border-border-color rounded-lg 
                       text-text-primary focus:border-accent-cyan focus:outline-none font-rajdhani"
            />
          </div>
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 bg-bg-secondary border-2 border-border-color rounded-lg 
                   text-text-primary focus:border-accent-cyan focus:outline-none font-rajdhani"
        >
          <option value="all">Todos los estados</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-bg-secondary rounded-lg border-2 border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border-color bg-bg-tertiary">
                <th className="px-6 py-4 text-left font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Recurso
                </th>
                <th className="px-6 py-4 text-left font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Ocupación
                </th>
                <th className="px-6 py-4 text-left font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Tareas
                </th>
                <th className="px-6 py-4 text-left font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Proyectos
                </th>
                <th className="px-6 py-4 text-left font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Solapamientos
                </th>
                <th className="px-6 py-4 text-left font-rajdhani font-bold text-accent-cyan uppercase text-sm">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecursos.map((recurso, index) => {
                const isCritical = recurso.Ocupacion > 100;
                const status = getStatusColor(recurso.Ocupacion);
                
                return (
                  <motion.tr
                    key={recurso.Recurso}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={clsx(
                      'border-b border-border-color hover:bg-bg-tertiary transition-colors',
                      isCritical && 'bg-accent-red/5'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isCritical && (
                          <AlertTriangle className="w-4 h-4 text-accent-red animate-pulse" />
                        )}
                        <span className="font-rajdhani font-semibold text-text-primary">
                          {recurso.Recurso}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-orbitron font-bold text-text-primary">
                            {formatPercentage(recurso.Ocupacion)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(recurso.Ocupacion, 120)}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={clsx('h-full rounded-full', getOcupacionColor(recurso.Ocupacion))}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-rajdhani text-text-primary">{recurso.Tareas}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-rajdhani text-text-primary">{recurso.Proyectos}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'font-rajdhani font-bold',
                        recurso.Max_Concurrentes >= 6 ? 'text-accent-red' : 'text-text-primary'
                      )}>
                        {recurso.Max_Concurrentes}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          'px-3 py-1 rounded text-xs font-rajdhani font-bold uppercase border',
                          status === 'critical' && 'border-accent-red text-accent-red bg-accent-red/20',
                          status === 'warning' && 'border-accent-orange text-accent-orange bg-accent-orange/20',
                          status === 'normal' && 'border-accent-cyan text-accent-cyan bg-accent-cyan/20',
                          status === 'good' && 'border-accent-green text-accent-green bg-accent-green/20'
                        )}
                      >
                        {recurso.Estado}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

