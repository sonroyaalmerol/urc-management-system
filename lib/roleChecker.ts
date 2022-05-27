import type { UserRole } from "@prisma/client";

const roleChecker = (roles: UserRole[], idOfRoleToCheck: string) => {
  return roles.filter((role) => role.id === idOfRoleToCheck).length > 0
}

export default roleChecker