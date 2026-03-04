/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        active: "#09637E",
        inactive: "#7AB2B2",
        background: "#EBF4F6",
        danger: "#DE1A58",
      },
      fontFamily: {
        regular: ["PoppinsRegular"],
        title: ["ParisienneRegular"],
        semibold: ["PoppinsSemiBold"],
      },
    },
  },
  plugins: [],
};
