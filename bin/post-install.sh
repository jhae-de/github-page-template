#!/bin/bash

printf "Copying assets ...\033[0K\r"

mkdir -p ./assets/fonts

cp -a ./node_modules/@fontsource-variable/roboto-flex/files/. ./assets/fonts
cp -a ./node_modules/@fontsource-variable/roboto-mono/files/. ./assets/fonts
cp -a ./node_modules/@fortawesome/fontawesome-free/webfonts/. ./assets/fonts

printf "Copying assets done.\033[0K\n"
