/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#1a1a2e',
        'bg-tertiary': '#16213e',
        'accent-cyan': '#00d2ff',
        'accent-red': '#e16162',
        'accent-green': '#00ff87',
        'accent-orange': '#ffa500',
        'text-primary': '#e6e6e6',
        'text-secondary': '#a6a6a6',
        'text-muted': '#666666',
        'border-color': '#0f3460',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 210, 255, 0.5), 0 0 20px rgba(0, 210, 255, 0.3)',
        'neon-red': '0 0 10px rgba(225, 97, 98, 0.5), 0 0 20px rgba(225, 97, 98, 0.3)',
        'neon-green': '0 0 10px rgba(0, 255, 135, 0.5), 0 0 20px rgba(0, 255, 135, 0.3)',
        'neon-orange': '0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

