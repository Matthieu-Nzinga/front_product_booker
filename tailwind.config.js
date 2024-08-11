/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", "sans-serif"],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #E0EAFF 0%, #F3E0FF 100%)',
      },
      colors: {
        customBlue: '#316CEA',
        customGray: '#6B6B6B',
      },
    },
  },
  plugins: [],
};
