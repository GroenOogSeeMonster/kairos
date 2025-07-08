#!/bin/bash

# Kairos - Fix Installation Script
# This script cleans up failed installations and retries

set -e

echo "🔧 Fixing Kairos installation..."
echo "=================================="

# Clean up any existing node_modules and package-lock files
echo "🧹 Cleaning up existing installations..."

if [ -d "backend/node_modules" ]; then
    echo "Removing backend/node_modules..."
    rm -rf backend/node_modules
fi

if [ -f "backend/package-lock.json" ]; then
    echo "Removing backend/package-lock.json..."
    rm -f backend/package-lock.json
fi

if [ -d "frontend/node_modules" ]; then
    echo "Removing frontend/node_modules..."
    rm -rf frontend/node_modules
fi

if [ -f "frontend/package-lock.json" ]; then
    echo "Removing frontend/package-lock.json..."
    rm -f frontend/package-lock.json
fi

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force

# Reinstall backend dependencies
echo "📦 Reinstalling backend dependencies..."
cd backend
npm install --legacy-peer-deps --no-audit
echo "✅ Backend dependencies installed"

# Reinstall frontend dependencies
echo "📦 Reinstalling frontend dependencies..."
cd ../frontend
npm install --legacy-peer-deps --no-audit
echo "✅ Frontend dependencies installed"

# Generate Prisma client
echo "🗄️  Setting up database..."
cd ../backend
npx prisma generate
echo "✅ Prisma client generated"

echo ""
echo "🎉 Installation fixed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your environment variables in backend/.env and frontend/.env"
echo "2. Set up your PostgreSQL database and update DATABASE_URL in backend/.env"
echo "3. Set up your Redis instance and update REDIS_URL in backend/.env"
echo "4. Get your OpenAI API key and add it to backend/.env"
echo "5. Configure Google OAuth credentials for calendar integration"
echo ""
echo "🚀 To start development:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "🐳 Or use Docker:"
echo "  docker-compose up -d"
echo ""
echo "Happy planning! 🎯" 