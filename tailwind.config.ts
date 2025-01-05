import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-glow": "pulseGlow 5s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 60px rgba(138,43,226, 0.7), inset 0 0 40px rgba(138,43,226, 0.5)",
          },
          "50%": {
            boxShadow:
              "0 0 100px rgba(138,43,226, 1), inset 0 0 80px rgba(138,43,226, 0.8)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
