/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        slate: {
          850: '#1e293b',
          950: '#020617',
        },
        status: {
          healthy: '#10b981',
          warning: '#f59e0b',
          critical: '#ef4444',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'dash': 'dash 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)' },
        },
        dash: {
          'to': { strokeDashoffset: '-20' }
        }
      }
    },
  },
  plugins: [],
};
