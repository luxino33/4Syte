/**
 * Prisma client singleton.
 *
 * `prisma generate` must run before this module is evaluated at runtime.
 * The build script (`prisma generate && next build`) and the `postinstall`
 * hook both ensure the generated client exists before Next.js tries to use it.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
