/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/bondage-academy-client/src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
