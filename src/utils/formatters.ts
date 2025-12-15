import { format } from 'date-fns';

export function formatDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return dateString as string;
    return format(date, 'dd/MM/yyyy');
  } catch {
    return dateString as string;
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

