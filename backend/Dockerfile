# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only production lock file and package.json
COPY package.json package-lock.prod.json ./
# Rename for npm
RUN mv package-lock.prod.json package-lock.json

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose port (change if your app uses a different port)
EXPOSE 3001

# Start the app
CMD ["node", "dist/index.js"] 