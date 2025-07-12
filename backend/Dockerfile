# Use official Node.js image (not Alpine for better Prisma compatibility)
FROM node:18

# Install netcat for health checks
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the entire project first
COPY . .

# Rename the production lock file
RUN mv package-lock.prod.json package-lock.json

# Install all dependencies
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Make startup script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 3001

# Start the app with the startup script
CMD ["./start.sh"] 