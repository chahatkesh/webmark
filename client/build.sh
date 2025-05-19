#!/bin/bash

echo "Installing all dependencies including dev dependencies..."
npm install --include=dev

echo "Running sitemap generator..."
node --experimental-modules src/utils/sitemapGenerator.js

echo "Building the application..."
./node_modules/.bin/vite build

echo "Build completed successfully."
