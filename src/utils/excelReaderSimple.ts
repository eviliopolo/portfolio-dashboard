import * as XLSX from 'xlsx';
import { ExcelData } from '../types';

// Función helper para convertir fechas de Excel (números seriales) a strings ISO
function convertExcelDate(value: any): string | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  
  // Si ya es un string, intentar parsearlo
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === 'N/A' || trimmed === 'n/a') return undefined;
    
    // Intentar diferentes formatos de fecha comunes
    const dateFormats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,  // DD/MM/YYYY
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,     // DD-MM-YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,     // YYYY-MM-DD
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,   // YYYY/MM/DD
    ];
    
    for (const format of dateFormats) {
      const match = trimmed.match(format);
      if (match) {
        let year, month, day;
        if (format.source.includes('^\\\\d{4}')) {
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else {
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = parseInt(match[3]);
        }
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
    }
    
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return trimmed;
  }
  
  if (typeof value === 'number') {
    if (value < 1 || value > 100000) return undefined;
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      if (year >= 1900 && year <= 2100) {
        return date.toISOString().split('T')[0];
      }
    }
  }
  
  if (value instanceof Date) {
    if (!isNaN(value.getTime())) {
      return value.toISOString().split('T')[0];
    }
  }
  
  return undefined;
}

function processDates(obj: any, dateFields: string[]): any {
  if (!obj || typeof obj !== 'object') return obj;
  const processed = { ...obj };
  dateFields.forEach(field => {
    if (field in processed) {
      processed[field] = convertExcelDate(processed[field]);
    }
  });
  return processed;
}

export async function readExcelFile(file: File | ArrayBuffer | string): Promise<ExcelData> {
  let workbook: XLSX.WorkBook;
  
  if (typeof file === 'string') {
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    workbook = XLSX.read(arrayBuffer, { type: 'array' });
  } else if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    workbook = XLSX.read(arrayBuffer, { type: 'array' });
  } else {
    workbook = XLSX.read(file, { type: 'array' });
  }

  const sheetNames = workbook.SheetNames;
  console.log('DEBUG - Hojas disponibles en Excel:', sheetNames);
  
  const data: ExcelData = {
    resumen: [],
    proyectos: [],
    recursos: [],
    matriz: [],
    tareas: [],
    solapamientos: [],
    timeline: [],
    metricas: [],
    capacidadEquipo: undefined,
  };

  let tempHorasDisponibles = 0;
  let tempHorasRequeridas = 0;

  // Leer cada hoja
  sheetNames.forEach((sheetName) => {
    console.log(`DEBUG - Procesando hoja: "${sheetName}"`);
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { 
      raw: true,
      defval: null
    });

    switch (sheetName) {
      case 'Dashboard_Resumen':
        data.resumen = jsonData as ExcelData['resumen'];
        break;
      case 'Proyectos':
        data.proyectos = (jsonData as any[]).map(item => {
          const processed: any = { ...item };
          
          // Mapear fechas
          if ('Fecha_Inicio' in processed) {
            processed.Inicio = processed.Fecha_Inicio;
            delete processed.Fecha_Inicio;
          }
          if ('Fecha_Fin' in processed) {
            processed.Fin = processed.Fecha_Fin;
            delete processed.Fecha_Fin;
          }
          if ('Fecha_Entrega' in processed) {
            processed.Entrega = processed.Fecha_Entrega;
            delete processed.Fecha_Entrega;
          }
          
          // Procesar fechas
          const processedWithDates = { ...processed };
          ['Inicio', 'Fin', 'Entrega'].forEach(field => {
            if (field in processedWithDates) {
              const value = processedWithDates[field];
              if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
                return;
              }
              const converted = convertExcelDate(value);
              if (converted) {
                processedWithDates[field] = converted;
              } else if (value === null || value === undefined || value === '') {
                processedWithDates[field] = undefined;
              }
            }
          });
          
          // Validar Horas_Totales
          if ('Horas_Totales' in processedWithDates) {
            const horas = processedWithDates.Horas_Totales;
            if (typeof horas === 'string') {
              const horasString: string = horas;
              const parsed = parseFloat(horasString.replace(/[^\d.-]/g, ''));
              processedWithDates.Horas_Totales = isNaN(parsed) ? 0 : parsed;
            } else if (typeof horas === 'number') {
              processedWithDates.Horas_Totales = (horas > 0 && horas < 1000000) ? horas : 0;
            } else {
              processedWithDates.Horas_Totales = 0;
            }
          }
          
          return processedWithDates;
        }) as ExcelData['proyectos'];
        break;
      case 'Recursos':
        data.recursos = jsonData as ExcelData['recursos'];
        break;
      case 'Matriz_Horas':
        data.matriz = jsonData as ExcelData['matriz'];
        
        // BUSCAR TOTAL EN MATRIZ_HORAS
        console.log('DEBUG - Buscando total en Matriz_Horas - TODOS LOS DATOS:', jsonData);
        jsonData.forEach((item: any, index: number) => {
          // Buscar CUALQUIER número grande
          Object.values(item).forEach(value => {
            if (typeof value === 'number' && value > 1000) {
              console.log(`DEBUG - Número grande en Matriz_Horas fila ${index}:`, value);
              if (value > tempHorasRequeridas) {
                tempHorasRequeridas = value;
              }
            }
          });
        });
        console.log('DEBUG - Horas requeridas encontradas:', tempHorasRequeridas);
        break;
      case 'Tareas':
        data.tareas = jsonData as ExcelData['tareas'];
        break;
      case 'Solapamientos':
        data.solapamientos = jsonData as ExcelData['solapamientos'];
        break;
      case 'Timeline':
        data.timeline = (jsonData as any[]).map(item => 
          processDates(item, ['Inicio', 'Fin'])
        ) as ExcelData['timeline'];
        break;
      case 'Metricas_Graficos':
        data.metricas = jsonData as ExcelData['metricas'];
        break;
      case 'Horas':
      case 'HORAS':
      case 'horas':
        // BUSCAR TOTAL EN HOJA HORAS
        console.log('DEBUG - Buscando total en Horas - TODOS LOS DATOS:', jsonData);
        jsonData.forEach((item: any, index: number) => {
          // Buscar CUALQUIER número grande
          Object.values(item).forEach(value => {
            if (typeof value === 'number' && value > 1000) {
              console.log(`DEBUG - Número grande en Horas fila ${index}:`, value);
              if (value > tempHorasDisponibles) {
                tempHorasDisponibles = value;
              }
            }
          });
        });
        console.log('DEBUG - Horas disponibles encontradas:', tempHorasDisponibles);
        break;
    }
  });

  // CALCULAR ANÁLISIS FINAL
  if (tempHorasDisponibles > 0 && tempHorasRequeridas > 0) {
    const porcentajeOcupacion = (tempHorasRequeridas / tempHorasDisponibles) * 100;
    const deficit = tempHorasRequeridas - tempHorasDisponibles;
    
    data.capacidadEquipo = {
      horasDisponibles: tempHorasDisponibles,
      horasRequeridas: tempHorasRequeridas,
      porcentajeOcupacion,
      deficit,
      estado: porcentajeOcupacion > 110 ? 'sobrecarga' : 
              porcentajeOcupacion > 95 ? 'equilibrio' : 'disponible'
    };
    
    console.log('DEBUG - Análisis de capacidad FINAL:', data.capacidadEquipo);
  } else {
    console.log('DEBUG - NO se pudo calcular capacidad:', { tempHorasDisponibles, tempHorasRequeridas });
  }

  return data;
}
