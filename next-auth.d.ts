import "next-auth";
import type { User } from '@prisma/client'

declare module "next-auth" {
  interface Session {
    user: Partial<User>;
  }
}