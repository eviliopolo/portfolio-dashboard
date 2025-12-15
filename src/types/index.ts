export interface KPIData {
  KPI: string;
  Valor: number | string;
  Unidad: string;
  Estado?: 'good' | 'warning' | 'critical' | 'normal';
}

export interface Proyecto {
  Proyecto: string;
  Inicio: string;
  Fin: string;
  Entrega: string;
  Tareas: number;
  Horas_Totales: number;
  Recursos: number;
  Estado: string;
  Prioridad: string;
  Progreso?: number;
  Color?: string;
}

export interface Recurso {
  Recurso: string;
  Ocupacion: number;
  Tareas: number;
  Proyectos: number;
  Max_Concurrentes: number;
  Estado: string;
  Categoria?: string;
}

export interface MatrizHoras {
  Proyecto: string;
  [key: string]: string | number; // Recurso: Horas
}

export interface Tarea {
  Tarea: string;
  Proyecto: string;
  Responsable: string;
  Inicio: string;
  Fin: string;
  Horas: number;
  Estado: string;
  Color?: string;
}

export interface Solapamiento {
  Recurso: string;
  Tareas: number;
  Max_Concurrentes: number;
  Horas_Totales: number;
  Nivel_Riesgo?: string;
}

export interface TimelineData {
  Tarea: string;
  Proyecto: string;
  Inicio: string;
  Fin: string;
  Color: string;
  Responsable?: string;
}

export interface MetricasGraficos {
  Proyecto?: string;
  Recurso?: string;
  Horas?: number;
  Ocupacion?: number;
  [key: string]: string | number | undefined;
}

export interface ExcelData {
  resumen: KPIData[];
  proyectos: Proyecto[];
  recursos: Recurso[];
  matriz: MatrizHoras[];
  tareas: Tarea[];
  solapamientos: Solapamiento[];
  timeline: TimelineData[];
  metricas: MetricasGraficos[];
}

