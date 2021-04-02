import { PrismaClient } from '@prisma/client';
declare global {
  var prisma: PrismaClient;
}
export const prisma =
  global.prisma ||
  ('production' === process.env.NODE_ENV
    ? new PrismaClient()
    : (global.prisma = new PrismaClient()));
