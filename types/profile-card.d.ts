import type {
  BookPublication,
  ExternalResearch,
  Institute,
  JournalPublication,
  Profile,
  ProfileToBookPublicationBridge,
  ProfileToExternalResearchBridge,
  ProfileToInstituteBridge,
  ProfileToJournalPublicationBridge,
  ProfileToProjectBridge,
  ProfileToResearchDisseminationBridge,
  ProfileToResearchPresentationBridge,
  Project,
  ResearchDissemination,
  ResearchPresentation,
  Unit,
  User,
  UserRole
} from '@prisma/client'

export interface ExtendedBookPublication extends BookPublication {
  units: Unit[];
  bridge_profiles: (ProfileToBookPublicationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  proof_upload: FileUpload;
}

export interface ExtendedExternalResearch extends ExternalResearch {
  bridge_profiles: (ProfileToExternalResearchBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  disseminations: ResearchDissemination[];
  file_upload: FileUpload;
  journal_publications: JournalPublication[];
  research_presentations: ResearchPresentation[];
}

export interface ExtendedProject extends Project {
  units: Unit[];
  bridge_profiles: (ProfileToProjectBridge & {
      profile: Profile & {
        user: User;
      };
  })[];
}

export interface ExtendedJournalPublication extends JournalPublication {
  units: Unit[];
  bridge_profiles: (ProfileToJournalPublicationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  proof_upload: FileUpload;
}

export interface ExtendedResearchDissemination extends ResearchDissemination {
  units: Unit[];
  bridge_profiles: (ProfileToResearchDisseminationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
}

export interface ExtendedResearchPresentation extends ResearchPresentation {
  units: Unit[];
  bridge_profiles: (ProfileToResearchPresentationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
}

export interface ExtendedProfile extends Profile {
  user: User;
  units: Unit[];
  bridge_institutes: (ProfileToInstituteBridge & {
    institute: Institute;
  })[];
  bridge_projects: (ProfileToProjectBridge & {
    project: Project;
  })[];
  bridge_external_researches: (ProfileToExternalResearchBridge & {
    external_research: ExternalResearch;
  })[];
  bridge_journal_publications: (ProfileToJournalPublicationBridge & {
    journal_publication: JournalPublication;
  })[];
  bridge_book_publications: (ProfileToBookPublicationBridge & {
    book_publication: BookPublication;
  })[];
  bridge_research_disseminations: (ProfileToResearchDisseminationBridge & {
    research_dissemination: ResearchDissemination;
  })[];
  bridge_research_presentations: (ProfileToResearchPresentationBridge & {
    presentation: ResearchPresentation;
  })[];
  roles: UserRole[];
}

export interface ComponentProps {
  profile: Partial<ExtendedProfile>;
}