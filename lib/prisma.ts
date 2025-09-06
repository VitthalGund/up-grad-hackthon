import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the Prisma Client instance.
declare global {
  var prisma: PrismaClient | undefined;
}

// Check if an instance already exists in the global scope. If not, create a new one.
// This prevents creating multiple instances in development due to hot-reloading.
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
