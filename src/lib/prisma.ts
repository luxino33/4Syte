/**
 * Prisma v7 client singleton using the pg driver adapter.
 *
 * Prisma v7 replaced the binary query engine with a WASM-based "client"
 * engine that requires a database adapter to be passed to the constructor
 * instead of reading DATABASE_URL automatically. We use @prisma/adapter-pg.
 *
 * The global singleton pattern prevents creating multiple PrismaClient
 * instances during Next.js hot-reload in development.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
