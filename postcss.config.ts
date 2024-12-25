import * as process from 'node:process';
import { Config } from 'postcss-load-config';

const config: Config = {
  plugins: {
    tailwindcss: {},
    rfs: {
      baseValue: '1.125rem',
      breakpoint: 1280,
    },
    autoprefixer: {},
  },
};

if (process.env.JEKYLL_ENV === 'production') {
  config.plugins = {
    ...config.plugins,
    cssnano: {
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    },
  };
}

export default config;
