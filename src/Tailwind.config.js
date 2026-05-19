/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7c5cfc",
          light: "#a688ff",
          dark: "#5a3fd4",
        },
        accent: "#f059c8",
        navy: {
          900: "#05050d",
          800: "#0f0f1a",
          700: "#1a1a2e",
          600: "#16213e",
          500: "#0f3460",
        },
      },
      backgroundImage: {
        "appbar-gradient":
          "linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        "login-glow-1":
          "radial-gradient(circle, rgba(79,70,229,0.30) 0%, transparent 70%)",
        "login-glow-2":
          "radial-gradient(circle, rgba(30,30,90,0.60) 0%, transparent 70%)",
        "accent-gradient":
          "linear-gradient(90deg, #a5b4fc, #6366f1)",
        "card-gradient":
          "linear-gradient(135deg, #7c5cfc, #f059c8)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};