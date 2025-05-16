/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        poppins:['Poppins','roboto']
      },
      colors:{
        bleuPerso: '#3333ff',
        vertPerso: '#00cc00',
        primaryClr:'#7A5AF8'
      }
    },
  },
  plugins: [],
}