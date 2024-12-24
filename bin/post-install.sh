#!/bin/bash

printf "Copying assets ...\033[0K\r"

mkdir -p ./_sass/vendor
mkdir -p ./_sass/vendor/@fontsource-variable/roboto-flex
mkdir -p ./_sass/vendor/@fontsource-variable/roboto-mono
mkdir -p ./_sass/vendor/@fortawesome/fontawesome-free
mkdir -p ./assets/fonts

cp -a ./node_modules/@fontsource-variable/roboto-flex/scss/. ./_sass/vendor/@fontsource-variable/roboto-flex
cp -a ./node_modules/@fontsource-variable/roboto-flex/files/. ./assets/fonts

cp -a ./node_modules/@fontsource-variable/roboto-mono/scss/. ./_sass/vendor/@fontsource-variable/roboto-mono
cp -a ./node_modules/@fontsource-variable/roboto-mono/files/. ./assets/fonts

cp -a ./node_modules/@fortawesome/fontawesome-free/scss/. ./_sass/vendor/@fortawesome/fontawesome-free
cp -a ./node_modules/@fortawesome/fontawesome-free/webfonts/. ./assets/fonts

cp -a ./node_modules/rfs/scss.scss ./_sass/vendor/rfs.scss

printf "Copying assets done.\033[0K\n"
