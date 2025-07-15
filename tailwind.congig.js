const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", ...fontFamily.serif],
        "serif-italic": ["var(--font-serif-italic)", ...fontFamily.serif],
        "serif-bold": ["var(--font-serif-bold)", ...fontFamily.serif],
      },
    },
  },
};
