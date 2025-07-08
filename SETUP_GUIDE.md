# Kairos Setup Guide

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kairos.git
   cd kairos
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment files
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your configuration
   nano backend/.env
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Git

#### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:3001" > .env
   echo "VITE_GOOGLE_CLIENT_ID=your-google-client-id" >> .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kairos"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App Configuration
NODE_ENV="development"
PORT="3001"
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL="http://localhost:3001"
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
```

## Required Services Setup

### 1. PostgreSQL Database

#### Local Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database
```sql
CREATE DATABASE kairos;
CREATE USER kairos_user WITH PASSWORD 'kairos_password';
GRANT ALL PRIVILEGES ON DATABASE kairos TO kairos_user;
```

#### Using Docker
```bash
docker run --name kairos-postgres \
  -e POSTGRES_DB=kairos \
  -e POSTGRES_USER=kairos_user \
  -e POSTGRES_PASSWORD=kairos_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 2. Redis Cache

#### Local Installation
```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis

# Windows
# Download from https://redis.io/download
```

#### Using Docker
```bash
docker run --name kairos-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### 3. OpenAI API

1. **Sign up for OpenAI**
   - Visit https://platform.openai.com/
   - Create an account and add billing information

2. **Generate API Key**
   - Go to API Keys section
   - Create a new secret key
   - Copy the key to your `.env` file

### 4. Google OAuth (Optional)

1. **Create Google Cloud Project**
   - Visit https://console.cloud.google.com/
   - Create a new project

2. **Enable OAuth 2.0**
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `http://localhost:3001/api/auth/google/callback`

3. **Configure Calendar API**
   - Enable Google Calendar API
   - Add calendar scopes to OAuth consent screen

## Development Workflow

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Database Management

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# View database in browser
npx prisma studio
```

## Production Deployment

### Using Docker Compose

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="postgresql://..."
   export REDIS_URL="redis://..."
   # ... other production variables
   ```

3. **Start production services**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Manual Deployment

#### Backend Deployment

1. **Build the application**
   ```bash
   cd backend
   npm run build
   ```

2. **Set up PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name kairos-backend
   pm2 save
   pm2 startup
   ```

#### Frontend Deployment

1. **Build the application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to web server**
   ```bash
   # Copy dist folder to web server
   scp -r dist/* user@server:/var/www/kairos/
   ```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U kairos_user -d kairos

# Reset database
npx prisma migrate reset
```

#### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping

# Check Redis logs
docker logs kairos-redis
```

#### Port Conflicts
```bash
# Check what's using port 3000/3001
lsof -i :3000
lsof -i :3001

# Kill process using port
kill -9 <PID>
```

#### Docker Issues
```bash
# Clean up Docker
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Logs

#### Backend Logs
```bash
# Docker
docker-compose logs backend

# Manual
tail -f backend/logs/app.log
```

#### Frontend Logs
```bash
# Check browser console
# Check network tab for API errors
```

## Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secrets for JWT
- Rotate API keys regularly
- Use environment-specific configurations

### Database Security
- Use strong passwords for database users
- Limit database access to application servers
- Enable SSL for database connections
- Regular database backups

### API Security
- Implement rate limiting
- Validate all input data
- Use HTTPS in production
- Implement proper CORS policies

## Performance Optimization

### Backend
- Enable Redis caching
- Implement database query optimization
- Use connection pooling
- Monitor API response times

### Frontend
- Enable code splitting
- Optimize bundle size
- Implement lazy loading
- Use CDN for static assets

## Monitoring and Analytics

### Application Monitoring
- Set up logging with Winston
- Implement health checks
- Monitor error rates
- Track API performance

### User Analytics
- Track user engagement
- Monitor feature usage
- Analyze user behavior
- A/B testing capabilities

## Support and Resources

### Documentation
- [API Documentation](./docs/API.md)
- [User Journey](./docs/USER_JOURNEY.md)
- [Mockups](./docs/MOCKUPS.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

### Community
- GitHub Issues: https://github.com/yourusername/kairos/issues
- Discord: https://discord.gg/kairos
- Email: support@kairos.app

### External Resources
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

This setup guide should help you get Kairos running quickly and efficiently. For additional support, please refer to the documentation or reach out to the community. 