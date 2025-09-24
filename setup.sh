#!/bin/bash

set -e

# Install Node.js and npm via apt
echo "Installing Node.js and npm..."
sudo apt update
sudo apt install -y nodejs npm curl

# Install NVM 
echo "Installing NVM..."
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into the current shell session
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verify NVM installation
command -v nvm

# Install and use Node.js v20
echo "Installing Node.js v20 using NVM..."
nvm install 20
nvm use 20

# Install required npm packages
echo "Installing npm packages..."
npm install cors express
npm install -D tailwindcss postcss autoprefixer
