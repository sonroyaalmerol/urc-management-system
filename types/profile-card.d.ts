import type {
  BookPublication,
  Comment,
  Deliverable,
  ExternalResearch,
  FileUpload,
  Institute,
  InstituteNews,
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
  ProjectStatus,
  ProjectToInstituteBridge,
  ResearchDissemination,
  ResearchEvent,
  ResearchPresentation,
  Submission,
  Unit,
  User,
  UserRole,
  VerificationRequest
} from '@prisma/client'

export interface ExtendedSubmission extends Submission {
  deliverable_submission: (DeliverableSubmission & {
    deliverable: Deliverable;
  });
  budget_proposal_submission: BudgetProposalSubmission;
  capsule_proposal_submission: CapsuleProposalSubmission;
  full_blown_proposal_submission: FullBlownProposalSubmission;
  profile: Profile;
  project: Project;
  files: FileUpload[];
  comments: (Comment & {
    profile: Profile;
  })[];
}

export interface ExtendedInstitute extends Institute {
  bridge_profiles: (ProfileToInstituteBridge & {
      profile: Profile;
  })[];
  institute_news: InstituteNews[];
}

export interface ExtendedResearchEvent extends ResearchEvent {
  profile: Profile;
  file_uploads: FileUpload[];
}

export interface ExtendedVerificationRequest extends VerificationRequest {
  proof_uploads: FileUpload[];
  external_research: ExternalResearch;
  journal_publication: JournalPublication;
  book_publication: BookPublication;
  research_dissemination: ResearchDissemination;
  research_event: ResearchEvent;
  research_presentation: ResearchPresentation;
  institute_news: InstituteNews & {
    institute: Institute;
    uploads: FileUpload[];
  };
  project_institute: ProjectToInstituteBridge & {
    project: Project;
    institute: Institute;
  }
  profile: Profile;
}

export interface ExtendedBookPublication extends BookPublication {
  units: Unit[];
  bridge_profiles: (ProfileToBookPublicationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  file_uploads: FileUpload[];
}

export interface ExtendedExternalResearch extends ExternalResearch {
  bridge_profiles: (ProfileToExternalResearchBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  disseminations: ResearchDissemination[];
  file_uploads: FileUpload[];
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
  project_status: ProjectStatus;
}

export interface ExtendedJournalPublication extends JournalPublication {
  units: Unit[];
  bridge_profiles: (ProfileToJournalPublicationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  file_uploads: FileUpload[];
}

export interface ExtendedResearchDissemination extends ResearchDissemination {
  units: Unit[];
  bridge_profiles: (ProfileToResearchDisseminationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  file_uploads: FileUpload[];
}

export interface ExtendedResearchPresentation extends ResearchPresentation {
  units: Unit[];
  bridge_profiles: (ProfileToResearchPresentationBridge & {
      profile: Profile & {
          user: User;
      };
  })[];
  file_uploads: FileUpload[];
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
  profile?: Partial<ExtendedProfile>;
  institute?: Partial<ExtendedInstitute>;
}