import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-navy": "#04111D",
        "primary-navy": "#071A2B",
        "navy-800": "#0A1F33",
        "navy-700": "#10293F",
        // Aftech — IT / Engineering (professional blue)
        aftech: {
          DEFAULT: "#1479D1",
          bright: "#2EA8FF",
          deep: "#04111D",
          navy: "#071A2B",
          ice: "#EAF5FF",
        },
        "aftech-teal": "#1479D1",
        "teal-bright": "#2EA8FF",
        "teal-tint": "#EAF5FF",
        // Halora — Civil / Interior: satu aksen perunggu + kertas linen netral
        halora: {
          bronze: "#B7791F",
          linen: "#FAF7F2",
        },
        ink: "#111827",
        muted: "#667085",
        line: "#E5E7EB",
        "off-white": "#F7F9FC",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        pro: "0 1px 2px rgba(4,17,29,0.06), 0 8px 24px -12px rgba(4,17,29,0.18)",
        card: "0 0 0 1px rgba(4,17,29,0.06), 0 12px 32px -16px rgba(4,17,29,0.22)",
        glow: "0 0 40px -8px rgba(46,168,255,0.45)",
      },
      borderRadius: {
        pro: "4px",
      },
      maxWidth: {
        container: "1360px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
