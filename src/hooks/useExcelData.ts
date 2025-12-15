import { useState, useEffect } from 'react';
import { readExcelFile } from '../utils/excelReader';
import { ExcelData } from '../types';

export function useExcelData(filePath: string) {
  const [data, setData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const excelData = await readExcelFile(filePath);
        setData(excelData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el archivo Excel');
        console.error('Error loading Excel:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filePath]);

  return { data, loading, error };
}

