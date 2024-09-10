/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Equivalent to indigo-600
          dark: '#3730A3', // Equivalent to indigo-700
          light: '#818CF8', // Equivalent to indigo-400
        },
        secondary: {
          DEFAULT: '#3B82F6', // Equivalent to blue-600
          dark: '#2563EB', // Equivalent to blue-700
          light: '#93C5FD', // Equivalent to blue-400
        },
        accent: '#FFFFFF', // White for buttons and text
        background: '#F9FAFB', // Light gray background equivalent to gray-50
        darkBackground: '#111827', // Dark background for footer, gray-900 equivalent
        text: '#4B5563', // Gray text equivalent to gray-600
        white: '#FFFFFF', // White text
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          600: '#4B5563',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Use a modern, clean font like Inter
      },
      fontSize: {
        base: '16px',
        lg: '18px',
        xl: '24px',
        '2xl': '30px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
      },
      spacing: {
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
      },
      borderRadius: {
        lg: '0.5rem',
        full: '9999px',
      },
      boxShadow: {
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
