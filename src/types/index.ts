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


export interface AnalisisCapacidad {
  horasDisponibles: number;
  horasRequeridas: number;
  porcentajeOcupacion: number;
  deficit: number;
  estado: 'sobrecarga' | 'equilibrio' | 'disponible';
}

export interface ProyectoHoras {
  proyecto: string;
  horas: number;
}

export interface RecursoCapacidad {
  nombre: string;
  horasDisponibles: number;
  horasAsignadas: number;
  ocupacion: number;
  sobrecarga: number;
  estado: 'sobrecargado' | 'equilibrio' | 'disponible';
  proyectos: ProyectoHoras[];
}

export interface JSONRecursosExport {
  fecha_generacion: string;
  total_recursos: number;
  recursos: Array<{
    recurso: string;
    capacidad: number;
    horas_asignadas_total: number;
    ocupacion: number;
    sobrecarga: number;
    estado: string;
    proyectos_asignados: Array<{
      proyecto: string;
      horas_asignadas: number;
    }>;
    total_proyectos: number;
  }>;
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
  capacidadEquipo?: AnalisisCapacidad;
  recursosCapacidad?: RecursoCapacidad[];
  jsonRecursos?: JSONRecursosExport;
}

