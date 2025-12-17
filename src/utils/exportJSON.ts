import { RecursoCapacidad } from '../types';

export interface RecursoJSON {
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
}

export interface JSONRecursosExport {
  fecha_generacion: string;
  total_recursos: number;
  recursos: RecursoJSON[];
}

export function generarJSONRecursos(recursosCapacidad: RecursoCapacidad[]): JSONRecursosExport {
  const recursos: RecursoJSON[] = recursosCapacidad.map(recurso => {
    return {
      recurso: recurso.nombre,
      capacidad: recurso.horasDisponibles,
      horas_asignadas_total: recurso.horasAsignadas,
      ocupacion: Math.round(recurso.ocupacion * 10) / 10,
      sobrecarga: recurso.sobrecarga,
      estado: recurso.estado,
      proyectos_asignados: recurso.proyectos.map(p => ({
        proyecto: p.proyecto,
        horas_asignadas: p.horas
      })),
      total_proyectos: recurso.proyectos.length
    };
  });

  return {
    fecha_generacion: new Date().toISOString(),
    total_recursos: recursos.length,
    recursos: recursos
  };
}

export function descargarJSON(data: JSONRecursosExport, nombreArchivo: string = 'recursos-proyectos.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copiarJSONAlPortapapeles(data: JSONRecursosExport): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  return navigator.clipboard.writeText(jsonString);
}

