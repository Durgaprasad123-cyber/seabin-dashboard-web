/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F6FC',
          100: '#E6F0FA',
          200: '#C8DEF2',
          600: '#2270B3',
          700: '#185E9A',
          800: '#0F4C81',
          900: '#073B68',
          950: '#031728',
        },
        ocean: {
          50: '#F2F7FC',
          100: '#E8F2FA',
          400: '#368CCB',
          500: '#1F6FA8',
          600: '#15558A',
          700: '#0E4A7B',
        },
        teal: {
          50: '#EFFCFB',
          100: '#D8F8F7',
          200: '#A2F3F0',
          300: '#5CE0DC',
          400: '#2CC4C0',
          500: '#10A9A5',
          600: '#0D8B88',
          700: '#0A7D7A',
          800: '#086260',
          900: '#054746',
        },
        ice: {
          50: '#F5FAFB',
          100: '#EDF6F8',
          200: '#DDEEF2',
          300: '#C7E2E8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(7, 59, 104, 0.05), 0 2px 8px 0 rgba(0, 0, 0, 0.02)',
        'glass-md': '0 12px 40px 0 rgba(7, 59, 104, 0.08), 0 4px 12px 0 rgba(0, 0, 0, 0.03)',
        'glow-teal': '0 0 20px rgba(16, 169, 165, 0.25)',
      }
    },
  },
  plugins: [],
}
