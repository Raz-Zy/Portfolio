/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Figma color system. `primary` is the light-sky-blue family
        // (#4FB5DB / #84CDE9), `accent` the vibrant blue family (#556EEB).
        // 50/100 map to bg-aliceblue/lightblue, 900 to text-primary slate.
        primary: {
          50: '#EEF9FF',
          100: '#DFEFFF',
          200: '#B9E4F5',
          300: '#A5D9EF',
          400: '#84CDE9',
          500: '#4FB5DB',
          600: '#3B9DC6',
          700: '#2F7FA6',
          800: '#2E637F',
          900: '#324C5B',
        },
        accent: {
          50: '#EEF1FE',
          100: '#E8F0FF',
          200: '#C9D6FA',
          300: '#A4B6F6',
          400: '#7C90F0',
          500: '#556EEB',
          600: '#4459D9',
          700: '#3847B5',
          800: '#303B8F',
          900: '#2B326E',
        },
      },
      fontFamily: {
        sans: ['var(--font-khmer)', 'system-ui', 'sans-serif'],
        khmer: ['var(--font-khmer)', 'sans-serif'],
      },
      boxShadow: {
        // Figma --shadow-primary; -lg is the hover/elevated variant.
        primary: '0px 0px 10px 0px rgba(0, 0, 0, 0.07)',
        'primary-lg': '0px 0px 18px 0px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

