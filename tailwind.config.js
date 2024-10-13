import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    fontFamily: {
      sans: [
        '"Roboto Flex Variable", ui-sans-serif, system-ui, sans-serif',
        {
          fontVariationSettings:
            "'slnt' 0, 'wdth' 100, 'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712",
        },
      ],
      mono: '"Source Code Pro Variable", ui-monospace, monospace',
    },
    colors: {
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      brand: {
        50: 'rgb(var(--theme-color-brand-50) / <alpha-value>)',
        100: 'rgb(var(--theme-color-brand-100) / <alpha-value>)',
        200: 'rgb(var(--theme-color-brand-200) / <alpha-value>)',
        300: 'rgb(var(--theme-color-brand-300) / <alpha-value>)',
        400: 'rgb(var(--theme-color-brand-400) / <alpha-value>)',
        500: 'rgb(var(--theme-color-brand-500) / <alpha-value>)',
        600: 'rgb(var(--theme-color-brand-600) / <alpha-value>)',
        700: 'rgb(var(--theme-color-brand-700) / <alpha-value>)',
        800: 'rgb(var(--theme-color-brand-800) / <alpha-value>)',
        900: 'rgb(var(--theme-color-brand-900) / <alpha-value>)',
        950: 'rgb(var(--theme-color-brand-950) / <alpha-value>)',
        DEFAULT: 'rgb(var(--theme-color-brand-default) / <alpha-value>)',
      },
    },
  },
};
