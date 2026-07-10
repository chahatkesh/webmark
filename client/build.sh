#!/bin/bash

echo "Running sitemap generator..."
node src/utils/sitemapGenerator.js

echo "Building the application..."
pnpm exec vite build

echo "Build completed successfully."
