#!/bin/bash

set -e  # Exit immediately if a command fails

echo "--Building Brace Compiler---"
echo ""
echo ""
echo "WARNING: If building braze_compiler fails, run install_tools.sh from braze_compiler to install proper toolchains!!!"
echo ""
echo ""


# Remove the braze_compiler folder if it exists
if [ -d "braze_compiler" ]; then
    echo "Removing existing braze_compiler directory..."
    rm -rf braze_compiler
fi

if [ -d "src/bin/braze" ]; then
    rm src/bin/braze
fi

# Clone the repository
echo "Cloning repository..."
git clone https://github.com/august95/braze_compiler.git

# Change into repo directory and build
echo "Building project..."

cd braze_compiler
make
cd ..

# Copy the built binary to /src/bin/
echo "Copying binary to /src/bin/..."
cp braze_compiler/braze src/bin/

echo "Done!"
