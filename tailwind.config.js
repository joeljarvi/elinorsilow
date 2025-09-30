const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        monument: ["var(--font-monument)"],
        haas: ["var(--font-haas)"],
        serif: ["var(--font-serif)", ...fontFamily.serif],
        "serif-italic": ["var(--font-serif-italic)", ...fontFamily.serif],
        "serif-bold": ["var(--font-serif-bold)", ...fontFamily.serif],
      },
    },
  },
};
