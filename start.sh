#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Starting the application..."
npm start


