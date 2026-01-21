#!/usr/bin/env bash
# Render build script
set -e

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

echo "Build completed successfully"
