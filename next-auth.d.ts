import "next-auth";
import type { Institute, User, UserToInstituteBridge, Profile } from '@prisma/client'

declare module "next-auth" {
  interface Session {
    user: Partial<User & { bridge_institutes: (UserToInstituteBridge & { institute: Institute; })[]}>;
    profile: Partial<Profile & {
      roles: UserRole[];
      bridge_institutes: (ProfileToInstituteBridge & {
          institute: Institute;
      })[];
    }>;
  }
}