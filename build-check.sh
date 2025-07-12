#!/bin/bash

echo "🔍 Checking Kairos build prerequisites..."

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found. Creating from example..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env from example"
    echo "📝 Please update backend/.env with your actual values"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Warning: frontend/.env not found. Creating..."
    echo "VITE_API_URL=http://localhost:3001" > frontend/.env
    echo "VITE_GOOGLE_CLIENT_ID=your-google-client-id" >> frontend/.env
    echo "✅ Created frontend/.env"
    echo "📝 Please update frontend/.env with your actual values"
fi

# Check TypeScript compilation
echo "🔧 Checking TypeScript compilation..."
cd backend
if npm run build > /dev/null 2>&1; then
    echo "✅ Backend TypeScript compilation successful"
else
    echo "❌ Backend TypeScript compilation failed"
    echo "Running npm run build to show errors:"
    npm run build
    exit 1
fi

cd ../frontend
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend TypeScript compilation successful"
else
    echo "❌ Frontend TypeScript compilation failed"
    echo "Running npm run build to show errors:"
    npm run build
    exit 1
fi

cd ..

echo "🎉 All build checks passed!"
echo ""
echo "🚀 You can now run:"
echo "   docker-compose build --no-cache"
echo "   docker-compose up -d"
echo ""
echo "📝 Remember to:"
echo "   1. Update environment variables in .env files"
echo "   2. Set up your database and Redis"
echo "   3. Configure OpenAI API key for AI features" 