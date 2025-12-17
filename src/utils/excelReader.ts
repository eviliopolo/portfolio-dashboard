import * as XLSX from 'xlsx';
import { ExcelData, RecursoCapacidad, ProyectoHoras } from '../types';
import { generarJSONRecursos as generarJSON } from './exportJSON';

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
    recursosCapacidad: [],
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
        // BUSCAR TOTAL EN HOJA HORAS + guardar datos completos
        console.log('DEBUG - Procesando hoja Horas - TODOS LOS DATOS:', jsonData);
        
        // Guardar datos crudos para análisis individual por persona
        (data as any).rawHorasData = jsonData;
        
        // Buscar CUALQUIER número grande (mayor a 1000) para el total general
        jsonData.forEach((item: any, index: number) => {
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

  // PROCESAR HORAS POR PERSONA
  try {
    const recursosCapacidad = procesarHorasPorPersona(workbook, data.matriz);
    if (recursosCapacidad && recursosCapacidad.length > 0) {
      data.recursosCapacidad = recursosCapacidad;
      console.log('DEBUG - Recursos con capacidad procesados:', recursosCapacidad);
      
      // GENERAR Y MOSTRAR JSON DE RECURSOS
      const jsonRecursos = generarJSON(recursosCapacidad);
      console.log('📄 JSON RECURSOS - Relación completa:', JSON.stringify(jsonRecursos, null, 2));
      
      // Guardar en el objeto data para acceso posterior
      (data as any).jsonRecursos = jsonRecursos;
    }
  } catch (error) {
    console.error('ERROR procesando horas por persona:', error);
  }

  return data;
}

// Función auxiliar para procesar horas por persona
function procesarHorasPorPersona(workbook: XLSX.WorkBook, matriz: any[]): RecursoCapacidad[] {
  const recursosCapacidad: RecursoCapacidad[] = [];

  // 1. Leer hoja Matriz_Horas directamente
  const matrizSheet = workbook.Sheets['Matriz_Horas'] || workbook.Sheets['Matriz_horas'] || workbook.Sheets['MATRIZ_HORAS'];
  if (!matrizSheet) {
    console.log('❌ DEBUG - No se encontró la hoja Matriz_Horas');
    return recursosCapacidad;
  }

  // 2. Leer hoja Horas directamente
  const horasSheet = workbook.Sheets['Horas'] || workbook.Sheets['HORAS'] || workbook.Sheets['horas'];
  if (!horasSheet) {
    console.log('❌ DEBUG - No se encontró la hoja Horas');
    return recursosCapacidad;
  }

  console.log('✅ DEBUG - Ambas hojas encontradas, procesando...');

  // 3. Extraer nombres de personas de la FILA 1 de Matriz_Horas (columnas B-I)
  const columnasLetras = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const nombresPersonas: Array<{ nombre: string; col: string; colIndex: number }> = [];
  
  for (let i = 0; i < columnasLetras.length; i++) {
    const col = columnasLetras[i];
    const cellNombre = matrizSheet[`${col}1`]; // FILA 1 tiene los nombres
    
    if (cellNombre && cellNombre.v) {
      const nombre = String(cellNombre.v).trim();
      if (nombre) {
        nombresPersonas.push({ 
          nombre, 
          col, 
          colIndex: i + 1 // B=1, C=2, ..., I=8
        });
        console.log(`👤 Persona encontrada: ${nombre} en columna ${col}`);
      }
    }
  }

  console.log(`✅ Total de personas encontradas: ${nombresPersonas.length}`);

  // 4. Leer todos los datos de Matriz_Horas como array
  const matrizData = XLSX.utils.sheet_to_json(matrizSheet, { header: 1, raw: true }) as any[][];
  console.log('📋 DEBUG - Matriz_Horas estructura (primeras 3 filas):');
  matrizData.slice(0, 3).forEach((row, idx) => {
    console.log(`  Fila ${idx + 1}:`, row);
  });

  // 5. Para cada persona, extraer sus proyectos y horas
  const proyectosPorPersona: { [nombre: string]: ProyectoHoras[] } = {};
  const horasAsignadasPorPersona: { [nombre: string]: number } = {};
  
  // Inicializar
  for (const persona of nombresPersonas) {
    proyectosPorPersona[persona.nombre] = [];
    horasAsignadasPorPersona[persona.nombre] = 0;
  }

  // Recorrer desde la fila 2 en adelante (fila 1 son los nombres)
  for (let rowIdx = 1; rowIdx < matrizData.length; rowIdx++) {
    const row = matrizData[rowIdx];
    const nombreProyecto = row[0]; // Columna A tiene el nombre del proyecto
    
    if (!nombreProyecto || String(nombreProyecto).trim() === '') continue;
    
    const proyecto = String(nombreProyecto).trim();
    
    // IGNORAR filas de TOTAL, totales, sumas, etc.
    const proyectoLower = proyecto.toLowerCase();
    if (proyectoLower === 'total' || 
        proyectoLower === 'totales' || 
        proyectoLower === 'suma' ||
        proyectoLower === 'subtotal' ||
        proyectoLower.includes('total general')) {
      console.log(`  ⏭️  Ignorando fila de resumen: "${proyecto}"`);
      continue;
    }
    
    // Para cada persona, ver sus horas en este proyecto
    for (const persona of nombresPersonas) {
      const horas = row[persona.colIndex]; // B=1, C=2, etc.
      
      if (typeof horas === 'number' && horas > 0) {
        proyectosPorPersona[persona.nombre].push({
          proyecto: proyecto,
          horas: horas
        });
        horasAsignadasPorPersona[persona.nombre] += horas;
        console.log(`  📌 ${persona.nombre} → ${proyecto}: ${horas}h`);
      }
    }
  }

  console.log('📊 Resumen de horas asignadas por persona:');
  for (const persona of nombresPersonas) {
    console.log(`  ${persona.nombre}: ${horasAsignadasPorPersona[persona.nombre]}h en ${proyectosPorPersona[persona.nombre].length} proyectos`);
  }

  // 6. Buscar capacidad en la hoja Horas
  // ESTRUCTURA: Columna A = Nombre persona (filas 2-8), Columna I = Total Horas
  const horasData = XLSX.utils.sheet_to_json(horasSheet, { header: 1, raw: true }) as any[][];
  console.log('📋 DEBUG - Estructura de hoja Horas (primeras 10 filas):');
  horasData.slice(0, 10).forEach((row, idx) => {
    console.log(`  Fila ${idx + 1}: Nombre="${row[0]}" | Total Horas (col I)="${row[8]}"`);
  });

  const horasDisponiblesPorPersona: { [nombre: string]: number } = {};
  
  // Recorrer filas 2-8 (índices 1-7) buscando los nombres en columna A
  for (const persona of nombresPersonas) {
    let capacidadEncontrada = false;
    
    // Buscar el nombre en la columna A (índice 0)
    for (let rowIdx = 1; rowIdx < horasData.length; rowIdx++) { // Empezar desde fila 2 (índice 1)
      const row = horasData[rowIdx];
      const nombreEnFila = row[0]; // Columna A (índice 0)
      
      if (!nombreEnFila) continue;
      
      // Comparar nombres
      if (String(nombreEnFila).trim().toLowerCase() === persona.nombre.toLowerCase()) {
        console.log(`🔍 ${persona.nombre}: Encontrado en fila ${rowIdx + 1}, columna A`);
        
        // Leer la columna I (índice 8) que tiene el Total Horas
        const capacidad = row[8]; // Columna I es índice 8
        
        if (typeof capacidad === 'number' && capacidad > 0) {
          horasDisponiblesPorPersona[persona.nombre] = capacidad;
          console.log(`✅ ${persona.nombre}: ${capacidad}h capacidad (Horas fila ${rowIdx + 1}, columna I "Total Horas")`);
          capacidadEncontrada = true;
          break;
        } else {
          console.log(`⚠️ ${persona.nombre}: Encontrado en fila ${rowIdx + 1} pero columna I tiene valor "${capacidad}" (tipo: ${typeof capacidad})`);
          // Intentar convertir si es string
          if (typeof capacidad === 'string') {
            const parsed = parseFloat(capacidad);
            if (!isNaN(parsed) && parsed > 0) {
              horasDisponiblesPorPersona[persona.nombre] = parsed;
              console.log(`✅ ${persona.nombre}: ${parsed}h capacidad (convertido de string)`);
              capacidadEncontrada = true;
              break;
            }
          }
        }
      }
    }
    
    if (!capacidadEncontrada) {
      horasDisponiblesPorPersona[persona.nombre] = 0;
      console.log(`❌ ${persona.nombre}: NO encontrado en hoja Horas columna A (filas 2-8)`);
    }
  }

  // 7. Crear objetos RecursoCapacidad
  console.log('📦 DEBUG - Creando objetos RecursoCapacidad:');
  for (const persona of nombresPersonas) {
    const horasDisponibles = horasDisponiblesPorPersona[persona.nombre] || 0;
    const horasAsignadas = horasAsignadasPorPersona[persona.nombre] || 0;
    const ocupacion = horasDisponibles > 0 ? (horasAsignadas / horasDisponibles) * 100 : 0;
    const sobrecarga = horasAsignadas - horasDisponibles;
    
    let estado: 'sobrecargado' | 'equilibrio' | 'disponible';
    if (ocupacion > 100) {
      estado = 'sobrecargado';
    } else if (ocupacion >= 95) {
      estado = 'equilibrio';
    } else {
      estado = 'disponible';
    }

    const recurso: RecursoCapacidad = {
      nombre: persona.nombre,
      horasDisponibles,
      horasAsignadas,
      ocupacion,
      sobrecarga,
      estado,
      proyectos: proyectosPorPersona[persona.nombre] || []
    };

    recursosCapacidad.push(recurso);
    
    console.log(`  ✓ ${persona.nombre}:`, {
      capacidad: horasDisponibles,
      asignadas: horasAsignadas,
      ocupacion: ocupacion.toFixed(1) + '%',
      sobrecarga: sobrecarga,
      estado,
      proyectos: recurso.proyectos.length
    });
  }

  console.log('🎉 Procesamiento completado!');
  return recursosCapacidad;
}
