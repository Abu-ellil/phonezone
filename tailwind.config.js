/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        subtle: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      ringOpacity: {
        50: "0.5",
      },
      colors: {
        primary: {
          light: "#ff3333",
          DEFAULT: "#ff0000",
          dark: "#cc0000",
        },
        secondary: {
          light: "#333333",
          DEFAULT: "#000000",
          dark: "#000000",
        },
        background: {
          light: "#ffffff",
          DEFAULT: "#ffffff",
          dark: "#121212",
        },
        text: {
          light: "#171717",
          DEFAULT: "#171717",
          dark: "#e0e0e0",
        },
        accent: {
          light: "#ff3333",
          DEFAULT: "#ff0000",
          dark: "#cc0000",
        },
      },
      fontFamily: {
        arabic: ["Arial", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
