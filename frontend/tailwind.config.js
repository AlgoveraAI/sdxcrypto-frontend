/** @type {import('tailwindcss').Config} */

const path = require("path");

module.exports = {
  important: true,
  content: [
    path.join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "./components/**/*.{js,ts,jsx,tsx}"),
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: "#1937D6", // https://www.color-hex.com/color/1937d6
        "primary-darker": "#112695",
        "primary-lighter": "#3b82f6",
        background: "#14141F",
        "background-darker": "#0D0D11",
      },
    },
  },
};
