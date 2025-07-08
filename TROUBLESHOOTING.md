# Kairos Troubleshooting Guide

## Installation Issues

### Package Version Conflicts
If you see errors like "No matching version found" or "ETARGET":
```bash
./fix-install.sh
```

### Permission Denied
If you get permission errors:
```bash
chmod +x install.sh
chmod +x fix-install.sh
```

### Node.js Version Issues
Ensure you have Node.js 18+ installed:
```bash
node --version
npm --version
```

### npm Warnings
Most npm warnings are harmless and won't affect functionality:
- `npm notice New major version of npm available` - This is just informational
- `npm warn deprecated` - These are deprecation warnings for dependencies, not errors

## Common Errors

### Frontend Build Errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Backend Build Errors
```bash
cd backend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npx prisma generate
```

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check your `DATABASE_URL` in `backend/.env`
3. Run database migrations:
```bash
cd backend
npx prisma migrate dev
```

### Redis Connection Issues
1. Ensure Redis is running
2. Check your `REDIS_URL` in `backend/.env`
3. Test connection:
```bash
redis-cli ping
```

### Port Already in Use
If ports 3000 or 3001 are already in use:
1. Change ports in `.env` files
2. Or kill existing processes:
```bash
# Find processes using the ports
lsof -i :3000
lsof -i :3001

# Kill the processes
kill -9 <PID>
```

## Docker Issues

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Migration Issues
```bash
# Run migrations in container
docker-compose exec backend npx prisma migrate dev

# Or reset database
docker-compose exec backend npx prisma migrate reset
```

## Environment Variables

### Missing Environment Variables
Ensure all required variables are set in `.env` files:

**Backend (.env):**
```
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
JWT_SECRET="your-secret"
OPENAI_API_KEY="your-key"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Frontend (.env):**
```
VITE_API_URL="http://localhost:3001"
VITE_GOOGLE_CLIENT_ID="your-client-id"
```

## Performance Issues

### Slow Build Times
```bash
# Clear npm cache
npm cache clean --force

# Use faster package manager
npm install -g pnpm
pnpm install
```

### Memory Issues
Increase Node.js memory limit:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Getting Help

1. Check the logs for specific error messages
2. Ensure all dependencies are properly installed
3. Verify environment variables are correctly set
4. Check that required services (PostgreSQL, Redis) are running
5. Try the fix script: `./fix-install.sh`

## Still Having Issues?

1. Check the [GitHub Issues](https://github.com/your-repo/kairos/issues)
2. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce 