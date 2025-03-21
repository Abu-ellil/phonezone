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
          light: "#f7941d",
          DEFAULT: "#f7941d",
          dark: "#d97706",
        },
        secondary: {
          light: "#333333",
          DEFAULT: "#333333",
          dark: "#1a1a1a",
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
          light: "#3498db",
          DEFAULT: "#3498db",
          dark: "#2980b9",
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
