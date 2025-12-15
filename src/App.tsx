import { motion } from 'framer-motion';
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
            className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-accent-primary text-xl font-sans font-medium">
            Cargando Dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center p-8 bg-bg-secondary border border-border-dark rounded-lg shadow-report-md max-w-md">
          <h2 className="text-2xl font-sans font-bold text-text-primary mb-4">
            Error al cargar datos
          </h2>
          <p className="text-text-secondary">{error}</p>
          <p className="text-text-muted text-sm mt-4">
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
    <div className="min-h-screen bg-white text-text-primary" style={{backgroundColor: '#ffffff'}}>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8 max-w-7xl bg-white" style={{backgroundColor: '#ffffff'}}>
        {/* Dashboard Gerencial - Informe Ejecutivo */}
        {data.proyectos && data.recursos && data.matriz && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="report-section"
          >
            <DashboardGerencial data={data} />
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-color py-6 mt-12">
        <div className="container mx-auto text-center max-w-7xl">
          <p className="text-text-muted text-xs font-sans">
            Portfolio Dashboard • Última actualización: {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

