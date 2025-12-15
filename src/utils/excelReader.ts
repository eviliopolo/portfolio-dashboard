import * as XLSX from 'xlsx';
import { ExcelData } from '../types';

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
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    switch (sheetName) {
      case 'Dashboard_Resumen':
        data.resumen = jsonData as ExcelData['resumen'];
        break;
      case 'Proyectos':
        data.proyectos = jsonData as ExcelData['proyectos'];
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
        data.timeline = jsonData as ExcelData['timeline'];
        break;
      case 'Metricas_Graficos':
        data.metricas = jsonData as ExcelData['metricas'];
        break;
    }
  });

  return data;
}

