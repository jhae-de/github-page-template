#!/usr/bin/env -S npx tsx

import esbuild, { BuildContext } from 'esbuild';
import process from 'node:process';

const isWatchModeEnabled: boolean = process.argv.slice(2).includes('--watch');

const buildContext: BuildContext = await esbuild.context({
  entryPoints: ['./assets/scripts/src/*.ts'],
  outdir: './assets/scripts',
  bundle: true,
  minify: process.env.JEKYLL_ENV === 'production',
  logLevel: 'info',
});

((): void => {
  console.log('Building scripts...');

  if (isWatchModeEnabled) {
    void buildContext.watch();

    return;
  }

  void buildContext.rebuild();
  void buildContext.dispose();

  console.log('Done.');
})();
