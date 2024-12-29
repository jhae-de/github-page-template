import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tslint from 'typescript-eslint';

export default tslint.config(
  {
    extends: [eslint.configs.recommended, ...tslint.configs.recommendedTypeChecked, prettier],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    extends: [tslint.configs.disableTypeChecked],
  },
  {
    ignores: ['_site', 'assets/scripts/*.js'],
  },
);
