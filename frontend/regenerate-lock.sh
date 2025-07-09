#!/bin/bash

echo "Cleaning up existing files..."
rm -rf node_modules package-lock.json

echo "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "Done! package-lock.json has been regenerated." 