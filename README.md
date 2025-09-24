# Braze UI 

Write c code in the left editor, and get assembly on the right editor

project root:
npm run dev

src/backend:
node server.js

installation:
sudo apt install nodejs npm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
command -v nvm
nvm install 20
nvm use 20
npm install cors
npm install express
npm install -D tailwindcss postcss autoprefixer
npm install -g @tailwindcss/cli
tailwindcss -i ./src/input.css -o ./dist/output.css --watch

uninstall:
npm uninstall tailwindcss
sudo apt-get remove nodejs npm

