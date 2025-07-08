#!/bin/bash

# Kairos - Repository Cleanup Script
# This script removes unnecessary files and prepares the repo for version control

set -e

echo "🧹 Cleaning up Kairos repository..."
echo "=================================="

# Remove node_modules directories
echo "🗑️  Removing node_modules..."
if [ -d "backend/node_modules" ]; then
    rm -rf backend/node_modules
    echo "✅ Removed backend/node_modules"
fi

if [ -d "frontend/node_modules" ]; then
    rm -rf frontend/node_modules
    echo "✅ Removed frontend/node_modules"
fi

# Remove package-lock files
echo "🗑️  Removing package-lock files..."
if [ -f "backend/package-lock.json" ]; then
    rm -f backend/package-lock.json
    echo "✅ Removed backend/package-lock.json"
fi

if [ -f "frontend/package-lock.json" ]; then
    rm -f frontend/package-lock.json
    echo "✅ Removed frontend/package-lock.json"
fi

# Remove build directories
echo "🗑️  Removing build directories..."
if [ -d "backend/dist" ]; then
    rm -rf backend/dist
    echo "✅ Removed backend/dist"
fi

if [ -d "frontend/dist" ]; then
    rm -rf frontend/dist
    echo "✅ Removed frontend/dist"
fi

if [ -d "frontend/build" ]; then
    rm -rf frontend/build
    echo "✅ Removed frontend/build"
fi

# Remove cache directories
echo "🗑️  Removing cache directories..."
if [ -d "backend/.cache" ]; then
    rm -rf backend/.cache
    echo "✅ Removed backend/.cache"
fi

if [ -d "frontend/.cache" ]; then
    rm -rf frontend/.cache
    echo "✅ Removed frontend/.cache"
fi

if [ -d "frontend/.parcel-cache" ]; then
    rm -rf frontend/.parcel-cache
    echo "✅ Removed frontend/.parcel-cache"
fi

# Remove log files
echo "🗑️  Removing log files..."
find . -name "*.log" -type f -delete 2>/dev/null || true
find . -name "npm-debug.log*" -type f -delete 2>/dev/null || true
find . -name "yarn-debug.log*" -type f -delete 2>/dev/null || true
find . -name "yarn-error.log*" -type f -delete 2>/dev/null || true
echo "✅ Removed log files"

# Remove TypeScript build info
echo "🗑️  Removing TypeScript build info..."
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
echo "✅ Removed TypeScript build info"

# Remove environment files (they should be in .gitignore but just in case)
echo "🗑️  Checking for environment files..."
if [ -f "backend/.env" ]; then
    echo "⚠️  Found backend/.env - make sure this is in .gitignore"
fi

if [ -f "frontend/.env" ]; then
    echo "⚠️  Found frontend/.env - make sure this is in .gitignore"
fi

# Remove OS generated files
echo "🗑️  Removing OS generated files..."
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
find . -name "Thumbs.db" -type f -delete 2>/dev/null || true
find . -name "ehthumbs.db" -type f -delete 2>/dev/null || true
echo "✅ Removed OS generated files"

# Remove IDE files
echo "🗑️  Removing IDE files..."
if [ -d ".vscode" ]; then
    rm -rf .vscode
    echo "✅ Removed .vscode"
fi

if [ -d ".idea" ]; then
    rm -rf .idea
    echo "✅ Removed .idea"
fi

# Remove temporary files
echo "🗑️  Removing temporary files..."
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.temp" -type f -delete 2>/dev/null || true
find . -name "*~" -type f -delete 2>/dev/null || true
echo "✅ Removed temporary files"

# Remove test coverage
echo "🗑️  Removing test coverage..."
if [ -d "coverage" ]; then
    rm -rf coverage
    echo "✅ Removed coverage"
fi

if [ -d "backend/coverage" ]; then
    rm -rf backend/coverage
    echo "✅ Removed backend/coverage"
fi

if [ -d "frontend/coverage" ]; then
    rm -rf frontend/coverage
    echo "✅ Removed frontend/coverage"
fi

# Remove Prisma generated files (keep migrations)
echo "🗑️  Removing Prisma generated files..."
if [ -d "backend/node_modules/.prisma" ]; then
    rm -rf backend/node_modules/.prisma
    echo "✅ Removed Prisma generated files"
fi

# Check repository size
echo ""
echo "📊 Repository size check:"
du -sh . 2>/dev/null || echo "Could not check repository size"

echo ""
echo "🎉 Cleanup completed successfully!"
echo ""
echo "📋 What was removed:"
echo "  ✅ node_modules directories"
echo "  ✅ package-lock.json files"
echo "  ✅ Build directories (dist, build)"
echo "  ✅ Cache directories"
echo "  ✅ Log files"
echo "  ✅ TypeScript build info"
echo "  ✅ OS generated files"
echo "  ✅ IDE files"
echo "  ✅ Temporary files"
echo "  ✅ Test coverage"
echo "  ✅ Prisma generated files"
echo ""
echo "📝 Next steps:"
echo "1. Review the changes: git status"
echo "2. Add files: git add ."
echo "3. Commit: git commit -m 'Initial commit'"
echo "4. Push: git push origin main"
echo ""
echo "💡 Remember:"
echo "  - .env files should NOT be committed (they're in .gitignore)"
echo "  - node_modules will be recreated when someone runs npm install"
echo "  - Build files will be generated when someone runs npm run build"
echo ""
echo "Happy coding! 🚀" 