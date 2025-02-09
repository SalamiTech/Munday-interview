/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          light: '#4D94FF',
          dark: '#0047B3',
        },
        accent: '#FF3366',
        warn: '#FF4444',
        success: '#00C853',
        info: '#0066FF',
        warning: '#FFA726',
        error: '#FF4444',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'text-primary': '#1A2B4B',
        'text-secondary': '#5A6B89',
        border: '#E5E9F0',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'md': '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12)',
        'lg': '0 8px 16px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.12)',
        'xl': '0 12px 24px rgba(0,0,0,0.1), 0 6px 12px rgba(0,0,0,0.15)',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's reset to avoid conflicts with Angular Material
  },
} 