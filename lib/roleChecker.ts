import { ExtendedProfile } from "../types/profile-card";

export const roleChecker = (profile: Partial<ExtendedProfile>, idsOfRoleToCheck: string[], options?: { exact?: boolean }) => {
  return profile.roles.filter((role) => idsOfRoleToCheck.includes(role.id)).length > 0 && (options?.exact ? idsOfRoleToCheck.length === profile.roles.length : true)
}

export const instituteHeadChecker = (profile: Partial<ExtendedProfile>, idOfInstitute: string) => {
  return profile.bridge_institutes.filter((bridge) => bridge.institute_id === idOfInstitute && bridge.is_head).length > 0
}