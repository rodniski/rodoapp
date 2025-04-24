// _lib/server/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // evita recriação do client em dev com hot reload
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ["query"], // opcional: remove em produção
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
