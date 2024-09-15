const plugins = {
  autoprefixer: {},
  tailwindcss: {},
};

if (process.env.JEKYLL_ENV === "production") {
  plugins.cssnano = {
    preset: "default",
  };
}

module.exports = {
  plugins,
};
