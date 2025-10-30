import { PrismaClient } from '@prisma/client';
declare let db: PrismaClient;
declare global {
    var __db: PrismaClient | undefined;
}
export { db };
