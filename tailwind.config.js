/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#ffffff',
        'bg-secondary': '#ffffff',
        'bg-tertiary': '#f8f9fa',
        'bg-card': '#fbfcfd',
        'accent-primary': '#1f2937',
        'accent-secondary': '#374151',
        'accent-muted': '#6b7280',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'text-muted': '#9ca3af',
        'text-light': '#d1d5db',
        'border-color': '#d1d5db',
        'border-light': '#9ca3af',
        'border-dark': '#6b7280',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
        'mono': ['Courier New', 'monospace'],
      },
      boxShadow: {
        'elegant': '0 1px 2px rgba(0, 0, 0, 0.02)',
        'elegant-md': '0 2px 4px rgba(0, 0, 0, 0.03)',
        'elegant-lg': '0 4px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
}

