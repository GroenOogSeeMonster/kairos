#!/bin/bash

# Debug: Print environment variables
echo "Environment variables:"
echo "DATABASE_URL: $DATABASE_URL"
echo "REDIS_URL: $REDIS_URL"
echo "NODE_ENV: $NODE_ENV"
echo "JWT_SECRET: $JWT_SECRET"

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Database is ready!"

# Wait for Redis to be ready
echo "Waiting for Redis to be ready..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "Redis is ready!"

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Debug: Check if Prisma client exists
echo "Checking Prisma client..."
ls -la node_modules/.prisma/client/
echo "Prisma client check complete"

# Start the application
echo "Starting Kairos backend..."
node dist/index.js 