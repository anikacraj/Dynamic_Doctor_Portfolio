/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}", // For Next.js
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",   // If using App Router
      "./src/**/*.{js,ts,jsx,tsx}",   // If using a src folder
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  