#!/bin/bash

# Kairos - AI-Powered Personal Planning Assistant
# Installation Script

set -e

echo "🚀 Setting up Kairos - AI-Powered Personal Planning Assistant"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Create environment files
echo "📝 Creating environment files..."

# Backend environment
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env (please configure your environment variables)"
else
    echo "⚠️  backend/.env already exists"
fi

# Frontend environment
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
EOF
    echo "✅ Created frontend/.env (please configure your environment variables)"
else
    echo "⚠️  frontend/.env already exists"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

# Generate Prisma client
echo "🗄️  Setting up database..."
cd ../backend
npx prisma generate
echo "✅ Prisma client generated"

echo ""
echo "🎉 Installation completed successfully!"
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
echo "📚 For more information, see the README.md file"
echo ""
echo "Happy planning! 🎯" 