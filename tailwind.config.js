/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14110F",
          raised: "#1C1815",
          hover: "#241E19",
        },
        parchment: {
          DEFAULT: "#EDE6DA",
          dim: "#A99C89",
          faint: "#6E6455",
        },
        amber: {
          DEFAULT: "#C9971F",
          bright: "#E0B23F",
        },
        teal: {
          DEFAULT: "#4F9C8C",
        },
        rust: {
          DEFAULT: "#B5533C",
        },
        hairline: "#2E2822",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
