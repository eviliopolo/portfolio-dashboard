import { motion } from 'framer-motion';
import Header from './components/layout/Header';
import DashboardGerencial from './components/dashboard/DashboardGerencial';
import { useExcelData } from './hooks/useExcelData';

function App() {
  const { data, loading, error } = useExcelData('/data/DASHBOARD_PORTAFOLIO.xlsx');

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-accent-cyan text-2xl font-orbitron animate-pulse">
            Cargando Dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center p-8 bg-bg-secondary border-2 border-accent-red rounded-lg">
          <h2 className="text-2xl font-rajdhani font-bold text-accent-red mb-4">
            Error al cargar datos
          </h2>
          <p className="text-text-secondary">{error}</p>
          <p className="text-text-secondary text-sm mt-4">
            Asegúrate de que el archivo DASHBOARD_PORTAFOLIO.xlsx esté en la carpeta public/data/
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative">
      {/* Efecto de escaneo */}
      <div className="scan-line" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto p-6 space-y-12 pb-12">
        {/* Dashboard Gerencial - Informe Ejecutivo */}
        {data.proyectos && data.recursos && data.matriz && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DashboardGerencial data={data} />
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t-2 border-border-color p-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-text-secondary font-rajdhani">
            Portfolio Dashboard • Análisis Gerencial de Proyectos
          </p>
          <p className="text-text-muted text-sm mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

