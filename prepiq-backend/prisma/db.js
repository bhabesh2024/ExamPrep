// prisma/db.js — Single shared Prisma instance
// Ek jagah se import karo, baar baar new PrismaClient() mat banao
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;