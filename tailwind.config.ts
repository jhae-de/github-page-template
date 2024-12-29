// @ts-expect-error: TS7016: Could not find a declaration file for module.
import gridAreasPlugin from '@savvywombat/tailwindcss-grid-areas';
import type { Config } from 'tailwindcss';
import { black, current, inherit, neutral, transparent, white } from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import { PluginAPI } from 'tailwindcss/types/config';
import { rfsPlugin } from './tailwind.plugin.rfs';
import { generateColors } from './tailwind.util';

export default {
  content: ['./{_includes,_layouts}/**/*.liquid', './assets/scripts/*.js', './index.liquid.html'],
  darkMode: ['selector', ':root[data-color-scheme="dark"]'],
  theme: {
    colors: {
      inherit,
      current,
      transparent,
      black,
      gray: neutral,
      white,
      ...generateColors('primary', 'secondary'),
    },
    fontFamily: {
      sans: [
        '"Roboto Flex Variable", ui-sans-serif, system-ui, sans-serif',
        {
          fontVariationSettings:
            "'slnt' 0, 'wdth' 100, 'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712",
        },
      ],
      mono: '"Roboto Mono Variable", ui-monospace, monospace',
    },
    extend: {
      gridTemplateAreas: {
        // prettier-ignore
        'app': [
          'app-header',
          'app-content',
          'app-footer',
        ],
        // prettier-ignore
        'app-header': [
          'app-header-logo app-header-title app-header-color-scheme app-header-menu',
        ],
      },
      gridTemplateColumns: {
        'app': '1fr',
        'app-header': 'auto 1fr auto',
      },
      gridTemplateRows: {
        'app': 'auto 1fr auto',
        'app-header': '1fr',
      },
      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/unbound-method
    plugin(({ matchUtilities, theme }: PluginAPI): void => {
      matchUtilities(
        { 'icon-size': (value: string): { fontSize: string } => ({ fontSize: value }) },
        { values: theme('spacing') },
      );
    }),
    gridAreasPlugin,
    rfsPlugin,
  ],
  variants: {
    gridTemplateAreas: ['responsive'],
  },
} satisfies Config;
