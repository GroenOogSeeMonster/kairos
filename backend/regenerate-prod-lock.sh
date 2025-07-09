#!/bin/bash

echo "Cleaning up existing files..."
rm -rf node_modules package-lock.json package-lock.prod.json

echo "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "Generating production lock file..."
npm install --omit=dev --legacy-peer-deps

echo "Copying production lock file..."
cp package-lock.json package-lock.prod.json

echo "Done! package-lock.prod.json has been regenerated." 