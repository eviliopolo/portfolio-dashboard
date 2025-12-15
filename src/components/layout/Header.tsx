import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b-2 border-border-color py-8" style={{backgroundColor: '#ffffff'}}>
      <div className="container mx-auto max-w-7xl px-6 bg-white" style={{backgroundColor: '#ffffff'}}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-sans font-bold text-text-primary">
              Portfolio Dashboard
            </h1>
            <p className="text-sm text-text-muted mt-1 font-sans">
              {currentTime.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-text-muted bg-bg-card px-4 py-2 rounded-lg border-2 border-border-color">
            <Clock className="w-4 h-4" />
            <span className="font-sans text-sm font-medium">
              {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

