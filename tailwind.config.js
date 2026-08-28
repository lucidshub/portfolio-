export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        "ink-soft": "#101013",
        paper: "#ece9e2",
        "paper-dim": "#9a958c",
        accent: "#149CEA",
        "accent-deep": "#1479EA",
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
        sans: ['Inter', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
    },
  },
  plugins: [],
};
