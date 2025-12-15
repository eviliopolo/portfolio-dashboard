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
    // Formato DD/MM/YYYY o DD-MM-YYYY
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
          // Formato YYYY-MM-DD o YYYY/MM/DD
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else {
          // Formato DD/MM/YYYY o DD-MM-YYYY
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = parseInt(match[3]);
        }
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        }
      }
    }
    
    // Intentar parsear como fecha estándar
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    // Si no se puede parsear, devolver el string original
    return trimmed;
  }
  
  // Si es un número, podría ser un serial de Excel
  if (typeof value === 'number') {
    // Excel almacena fechas como números seriales desde el 1 de enero de 1900
    // Los números seriales de Excel para fechas típicamente están entre:
    // - 1 (1 de enero de 1900) ≈ 1
    // - 73050 (1 de enero de 2100) ≈ 73050
    // Si el número es muy grande, probablemente NO es una fecha
    if (value < 1 || value > 100000) return undefined;
    
    // Convertir a fecha JavaScript
    // Nota: Excel tiene un bug conocido donde considera 1900 como año bisiesto
    const excelEpoch = new Date(1899, 11, 30); // 30 de diciembre de 1899
    const date = new Date(excelEpoch.getTime() + value * 86400000); // 86400000 ms = 1 día
    
    // Validar que la fecha sea razonable (entre 1900 y 2100)
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      if (year >= 1900 && year <= 2100) {
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }
    }
  }
  
  // Si es un objeto Date
  if (value instanceof Date) {
    if (!isNaN(value.getTime())) {
      return value.toISOString().split('T')[0];
    }
  }
  
  return undefined;
}

// Función para procesar objetos y convertir fechas
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
    // Si es una ruta, leer desde URL
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    workbook = XLSX.read(arrayBuffer, { type: 'array' });
  } else if (file instanceof File) {
    // Si es un File object
    const arrayBuffer = await file.arrayBuffer();
    workbook = XLSX.read(arrayBuffer, { type: 'array' });
  } else {
    // Si es un ArrayBuffer
    workbook = XLSX.read(file, { type: 'array' });
  }

  const sheetNames = workbook.SheetNames;
  
  const data: ExcelData = {
    resumen: [],
    proyectos: [],
    recursos: [],
    matriz: [],
    tareas: [],
    solapamientos: [],
    timeline: [],
    metricas: [],
  };

  // Leer cada hoja
  sheetNames.forEach((sheetName) => {
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
    }
  });

  return data;
}
