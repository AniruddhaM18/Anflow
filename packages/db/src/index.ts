import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaClientGlobal: PrismaClient | undefined;
}

// Create or reuse global cached instance
export const prismaClient =
  globalThis.prismaClientGlobal ??
  new PrismaClient({
    log: ["query"], // optional
  });

// Cache in dev mode
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClientGlobal = prismaClient;
}

// Re-export Prisma models/types
export * from "@prisma/client";
