#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Serving the application..."
npx serve -s dist -l $PORT