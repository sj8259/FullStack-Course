/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#050816",
          secondary: "#aaa6c3",
          tertiary: "#151030",
        },
        backgroundImage: {
          "hero-pattern": "url('/src/assets/herobg.png')",
        },
      },
    },
    plugins: [],
  };

  