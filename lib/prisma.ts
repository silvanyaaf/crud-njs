import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if(process.env.KODE_ENV !== "production") globalThis.prisma = prisma;