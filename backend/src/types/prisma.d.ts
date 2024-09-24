import { Prisma } from '@prisma/client';

declare global {
  namespace PrismaTypes {
    interface PrismaClientKnownRequestError extends Prisma.PrismaClientKnownRequestError {}
  }
}