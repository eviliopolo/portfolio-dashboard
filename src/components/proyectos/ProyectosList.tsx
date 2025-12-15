import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import ProyectoCard from './ProyectoCard';
import { Proyecto } from '../../types';

interface ProyectosListProps {
  proyectos: Proyecto[];
}

type SortField = 'Horas_Totales' | 'Tareas' | 'Recursos' | 'Proyecto';
type SortDirection = 'asc' | 'desc';

export default function ProyectosList({ proyectos }: ProyectosListProps) {
  const [sortField, setSortField] = useState<SortField>('Horas_Totales');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProyectos = [...proyectos].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal);
    const bStr = String(bVal);
    return sortDirection === 'asc' 
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  return (
    <div>
      {/* Controles de ordenamiento */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => handleSort('Horas_Totales')}
          className={`px-4 py-2 rounded border font-sans text-sm transition-all ${
            sortField === 'Horas_Totales'
              ? 'border-text-primary text-text-primary bg-bg-tertiary'
              : 'border-border-color text-text-secondary hover:border-text-primary bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            Horas
            {sortField === 'Horas_Totales' && (
              sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
            )}
          </div>
        </button>
        <button
          onClick={() => handleSort('Tareas')}
          className={`px-4 py-2 rounded border font-sans text-sm transition-all ${
            sortField === 'Tareas'
              ? 'border-text-primary text-text-primary bg-bg-tertiary'
              : 'border-border-color text-text-secondary hover:border-text-primary bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            Tareas
            {sortField === 'Tareas' && (
              sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
            )}
          </div>
        </button>
        <button
          onClick={() => handleSort('Recursos')}
          className={`px-4 py-2 rounded border font-sans text-sm transition-all ${
            sortField === 'Recursos'
              ? 'border-text-primary text-text-primary bg-bg-tertiary'
              : 'border-border-color text-text-secondary hover:border-text-primary bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            Recursos
            {sortField === 'Recursos' && (
              sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProyectos.map((proyecto, index) => (
          <motion.div
            key={proyecto.Proyecto}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProyectoCard proyecto={proyecto} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

