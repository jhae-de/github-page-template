const plugins = {
  tailwindcss: {},
  rfs: {
    baseValue: '1.125rem',
    breakpoint: 1280,
  },
  autoprefixer: {},
};

if (process.env.JEKYLL_ENV === 'production') {
  plugins.cssnano = {
    preset: 'default',
  };
}

module.exports = {
  plugins,
};
