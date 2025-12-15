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
    if (ocupacion > 110) return 'bg-text-primary';
    if (ocupacion >= 100) return 'bg-text-secondary';
    if (ocupacion >= 85) return 'bg-text-muted';
    return 'bg-border-dark';
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
              className="w-full pl-10 pr-4 py-2 bg-white border border-border-color rounded 
                       text-text-primary focus:border-text-primary focus:outline-none font-sans"
            />
          </div>
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 bg-white border border-border-color rounded 
                   text-text-primary focus:border-text-primary focus:outline-none font-sans"
        >
          <option value="all">Todos los estados</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded border border-border-color overflow-hidden shadow-report-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-dark bg-bg-tertiary">
                <th className="px-6 py-4 text-left font-sans font-semibold text-text-primary uppercase text-xs tracking-wider">
                  Recurso
                </th>
                <th className="px-6 py-4 text-left font-sans font-semibold text-text-primary uppercase text-xs tracking-wider">
                  Ocupación
                </th>
                <th className="px-6 py-4 text-left font-sans font-semibold text-text-primary uppercase text-xs tracking-wider">
                  Tareas
                </th>
                <th className="px-6 py-4 text-left font-sans font-semibold text-text-primary uppercase text-xs tracking-wider">
                  Proyectos
                </th>
                <th className="px-6 py-4 text-left font-sans font-semibold text-text-primary uppercase text-xs tracking-wider">
                  Solapamientos
                </th>
                <th className="px-6 py-4 text-left font-sans font-semibold text-text-primary uppercase text-xs tracking-wider">
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
                      'border-b border-border-color hover:bg-bg-secondary transition-colors',
                      isCritical && 'bg-bg-tertiary'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isCritical && (
                          <AlertTriangle className="w-4 h-4 text-text-primary" />
                        )}
                        <span className="font-sans font-semibold text-text-primary">
                          {recurso.Recurso}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-sans font-semibold text-text-primary">
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
                      <span className="font-sans text-text-primary">{recurso.Tareas}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans text-text-primary">{recurso.Proyectos}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'font-sans font-semibold',
                        recurso.Max_Concurrentes >= 6 ? 'text-text-primary' : 'text-text-secondary'
                      )}>
                        {recurso.Max_Concurrentes}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          'px-3 py-1 rounded text-xs font-sans font-semibold uppercase border',
                          status === 'critical' && 'border-text-primary text-text-primary bg-bg-tertiary',
                          status === 'warning' && 'border-text-secondary text-text-secondary bg-bg-secondary',
                          status === 'normal' && 'border-border-color text-text-secondary bg-white',
                          status === 'good' && 'border-border-color text-text-secondary bg-white'
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

