import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary border-b-2 border-accent-cyan shadow-neon-cyan p-6 relative overflow-hidden"
    >
      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-orbitron font-bold text-accent-cyan glow-text"
            >
              PORTFOLIO DASHBOARD
            </motion.h1>
            <p className="text-text-secondary mt-2 font-rajdhani text-lg">
              Análisis Gerencial de Proyectos
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-accent-cyan">
              <Clock className="w-5 h-5" />
              <span className="font-orbitron text-lg">
                {currentTime.toLocaleTimeString('es-ES')}
              </span>
            </div>
            <div className="px-4 py-2 bg-accent-green/20 border-2 border-accent-green rounded-lg">
              <span className="text-accent-green font-rajdhani font-bold text-sm uppercase tracking-wider">
                CASI VIABLE
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-text-secondary font-rajdhani">
          {currentTime.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Efecto de fondo */}
      <div className="absolute inset-0 opacity-10 cyber-grid"></div>
    </motion.header>
  );
}

