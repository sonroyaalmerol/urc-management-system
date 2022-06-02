import { ProfileToBookPublicationBridge, ProfileToExternalResearchBridge, ProfileToInstituteBridge, ProfileToJournalPublicationBridge, ProfileToProjectBridge, ProfileToResearchDisseminationBridge, ProfileToResearchEventBridge, ProfileToResearchPresentationBridge } from "@prisma/client";
import { ExtendedProfile } from "../types/profile-card";

export const roleChecker = (profile: Partial<ExtendedProfile>, idsOfRoleToCheck: string[], options?: { exact?: boolean }) => {
  return profile.roles.filter((role) => idsOfRoleToCheck.includes(role.id)).length > 0 && (options?.exact ? idsOfRoleToCheck.length === profile.roles.length : true)
}

export const instituteHeadChecker = (profile: Partial<ExtendedProfile>, idOfInstitute: string) => {
  return profile.bridge_institutes.filter((bridge) => bridge.institute_id === idOfInstitute && bridge.is_head).length > 0
}

export const memberChecker = (profile: Partial<ExtendedProfile>, members: Partial<
  ExtendedProfile | 
  ProfileToProjectBridge |
  ProfileToInstituteBridge |
  ProfileToResearchEventBridge |
  ProfileToBookPublicationBridge |
  ProfileToExternalResearchBridge |
  ProfileToJournalPublicationBridge |
  ProfileToResearchPresentationBridge |
  ProfileToResearchDisseminationBridge
>[]) => {
  return members.filter((member) => {
    if ('id' in member) {
      return member.id === profile.id
    }

    if ('profile_id' in member) {
      return member.profile_id === profile.id
    }

    return false
  }).length > 0
}