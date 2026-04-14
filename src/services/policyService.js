import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPolicy(clientId, endpoint) {
  return await prisma.ratePolicy.findUnique({
    where: {
      clientId_endpoint: { clientId, endpoint },
    },
  });
}

export async function createPolicy(data) {
  return await prisma.ratePolicy.create({ data });
}

export async function pingDB() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}