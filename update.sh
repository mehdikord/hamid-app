#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR;
pwd;
git pull origin master;
nvm use 23;
pnpm install;
pnpm run build;
cp .htaccess.example dist/.htaccess;
