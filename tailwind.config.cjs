/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        christmas: {
          50: "#fff8f6",
          100: "#ffece6",
          300: "#ffb4a1",
          500: "#ff6b35",
          700: "#b33a24",
        },
      },
    },
  },
  plugins: [],
};
