/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: "#1937D6", // https://www.color-hex.com/color/1937d6
        "primary-darker": "#112695",
        "primary-lighter": "#465ede",
        background: "#0f172a",
      },
    },
  },
};
