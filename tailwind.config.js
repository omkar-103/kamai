/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        primary: "#2b0b3a",        // brand / background
        accent: "#0fd3c1",         // highlights / CTA
        bg: "#0f0a12",             // app background
        "text-primary": "#ffffff",
        "text-secondary": "#a0aec0",
        success: "#48bb78",
        warning: "#ed8936",
        error: "#f56565",
        "muted-ul": "#a0aec0"      // base ul color
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        glass: "0 6px 18px rgba(11,8,18,0.6)",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

