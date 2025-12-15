import { format } from 'date-fns';

export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return '-';
  
  try {
    let date: Date;
    
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      const trimmed = dateString.trim();
      if (!trimmed || trimmed === '-' || trimmed === 'N/A' || trimmed === 'n/a') {
        return '-';
      }
      
      // Si ya está en formato YYYY-MM-DD, parsearlo directamente
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        // Parsear manualmente para evitar problemas de zona horaria
        const [year, month, day] = trimmed.split('-').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        // Intentar parsear como fecha
        date = new Date(trimmed);
      }
    } else {
      return '-';
    }
    
    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      // Si no se puede parsear, devolver el string original si es razonable
      if (typeof dateString === 'string' && dateString.length > 0) {
        return dateString;
      }
      return '-';
    }
    
    // Formatear la fecha
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    // Si hay un error, intentar devolver el valor original si es un string
    if (typeof dateString === 'string' && dateString.length > 0) {
      return dateString;
    }
    return '-';
  }
}

export function formatNumber(value: number | string): string {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('es-ES').format(value);
}

export function formatPercentage(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
}

export function getStatusColor(ocupacion: number): 'good' | 'warning' | 'critical' | 'normal' {
  if (ocupacion > 110) return 'critical';
  if (ocupacion >= 100) return 'warning';
  if (ocupacion >= 85) return 'normal';
  return 'good';
}

export function getProjectColor(proyecto: string): string {
  const colors: Record<string, string> = {
    'XTAM VMS': '#e16162',
    'Onvif': '#ffa500',
    'Chatbot': '#00d2ff',
    'Ceres': '#9b59b6',
    'XTAM NOC': '#27ae60',
    'Otros': '#f39c12',
    'Informe': '#3498db',
    'Control': '#e74c3c',
  };
  return colors[proyecto] || '#00d2ff';
}

