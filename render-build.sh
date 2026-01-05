#!/usr/bin/env bash
# Render build script

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

echo "Build completed successfully"
