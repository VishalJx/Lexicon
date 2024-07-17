// @type {import('tailwindcss').Config}


module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        customLight: '0px 0px 20px rgba(0, 0, 0, 0.09)',
        customDark: '0px 0px 20px rgba(0, 0, 0, 0.2)',
      },
      maxWidth:{
        container: "1440px",
        contentContainer: "1140px",
        containerSmall: "1024px",
        containerxs:"768px",
      },
      fontFamily:{
        font1: ['Manrope', 'sans-serif'],
        font2: ['Playfair Display','serif'],
        font3: ['Poppins', 'sans-serif'],
        font4: ['Montserrat', 'sans-serif'],
      },
      fontWeight:{
        thin:200,
        light:400,
        bold:500,
        bolder:700,
        boldest:900
      },
      colors:{
        primary:'#F5F5F5',
        secondary:'#3A4E63',
        highlighter:'#A8C3D7',
        tertiary: '#FFF314',
      },
      screens :{
        xs: '320px',
        sm: '350px',
        sml: '500px',
        md: '667px',
        mdl: '768px',
        lg: '960px',
        lgl: '1024px',
        xl: '1280px',
      },
      boxShadow:{
        sharpShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
        deepShadow: 'rgb(204, 219, 232) 3px 3px 6px 3px inset, rgba(255, 255, 255, 0.8) -3px -3px 6px 1px inset',
        buttonShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
      }
    },
  },
  plugins: [],
};
