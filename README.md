# Portfolio Dashboard

Dashboard ejecutivo en React con tema blacklight/cyberpunk para presentar análisis de portafolio de proyectos a gerencia.

## 🚀 Características

- **Tema Visual Blacklight/Cyberpunk**: Diseño oscuro con efectos neón y animaciones
- **KPIs en Tiempo Real**: 7 indicadores clave con estados visuales
- **Gestión de Proyectos**: Vista de tarjetas con información detallada
- **Análisis de Recursos**: Tabla interactiva con ocupación y alertas
- **Matriz de Horas**: Heatmap interactivo proyectos × recursos
- **Gráficos Analíticos**: Pie chart, barras horizontales y Gantt chart
- **Panel de Alertas**: Notificaciones de recursos críticos y solapamientos

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Clonar o descargar el proyecto
2. Instalar dependencias:

```bash
npm install
```

3. Colocar el archivo Excel `DASHBOARD_PORTAFOLIO.xlsx` en la carpeta `public/data/`

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

5. Abrir el navegador en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
portfolio-dashboard/
├── src/
│   ├── components/
│   │   ├── kpis/          # Componentes de KPIs
│   │   ├── proyectos/     # Componentes de proyectos
│   │   ├── recursos/      # Componentes de recursos
│   │   ├── charts/        # Componentes de gráficos
│   │   ├── alerts/        # Componentes de alertas
│   │   └── layout/        # Componentes de layout
│   ├── utils/             # Utilidades (lector Excel, formatters)
│   ├── hooks/             # Custom hooks
│   ├── types/             # Definiciones TypeScript
│   ├── styles/            # Estilos CSS
│   └── App.tsx            # Componente principal
├── public/
│   └── data/              # Archivo Excel aquí
└── package.json
```

## 📊 Archivo Excel Requerido

El archivo `DASHBOARD_PORTAFOLIO.xlsx` debe contener las siguientes hojas:

1. **Dashboard_Resumen**: KPIs principales
2. **Proyectos**: Información de proyectos
3. **Recursos**: Datos de recursos y ocupación
4. **Matriz_Horas**: Distribución horas por proyecto-responsable
5. **Tareas**: Tareas detalladas
6. **Solapamientos**: Análisis de concurrencia
7. **Timeline**: Datos para Gantt chart
8. **Metricas_Graficos**: Datos agregados para visualizaciones

## 🎨 Personalización

### Colores

Editar `tailwind.config.js` para personalizar la paleta de colores:

```javascript
colors: {
  'bg-primary': '#0a0a0a',
  'accent-cyan': '#00d2ff',
  // ...
}
```

### Fuentes

Las fuentes Orbitron y Rajdhani están configuradas en `index.html` y `theme.css`.

## 📦 Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## 🐛 Solución de Problemas

### El Excel no se carga

- Verificar que el archivo esté en `public/data/DASHBOARD_PORTAFOLIO.xlsx`
- Verificar que todas las hojas tengan los nombres correctos
- Revisar la consola del navegador para errores

### Errores de tipos TypeScript

```bash
npm install --save-dev @types/react @types/react-dom
```

## 📝 Licencia

Este proyecto es de uso interno.

## 👥 Autor

Equipo de Análisis de Portafolio

