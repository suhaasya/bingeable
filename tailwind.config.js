/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      green: "#4ec06f",
      red: "#ff6154",
      white: "#ffffff",
      light_gray: "#f7f7f7",
      gray: "#e3e3e3",
    },
  },
  plugins: [],
}
