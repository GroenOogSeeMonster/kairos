import { PrismaClient } from '@prisma/client';

// Create a singleton instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma client with explicit configuration
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if ((process.env as any).NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma; 