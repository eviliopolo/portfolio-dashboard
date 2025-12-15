import { 
  Briefcase, 
  CheckSquare, 
  Clock, 
  Users, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp 
} from 'lucide-react';
import KPICard from './KPICard';
import { KPIData } from '../../types';
import { getStatusColor } from '../../utils/formatters';

interface KPIGridProps {
  kpis: KPIData[];
}

const iconMap: Record<string, typeof Briefcase> = {
  'Proyectos Activos': Briefcase,
  'Tareas Totales': CheckSquare,
  'Horas Totales': Clock,
  'Ocupación Fábrica': Users,
  'Recursos Críticos': AlertTriangle,
  'Déficit Neto': TrendingDown,
  'Capacidad Disponible': TrendingUp,
};

export default function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = iconMap[kpi.KPI] || Briefcase;
        const status = kpi.Estado || getStatusColor(
          typeof kpi.Valor === 'number' ? kpi.Valor : parseFloat(String(kpi.Valor)) || 0
        );

        return (
          <KPICard
            key={index}
            icon={Icon}
            title={kpi.KPI}
            value={kpi.Valor}
            unit={kpi.Unidad}
            status={status}
          />
        );
      })}
    </div>
  );
}

