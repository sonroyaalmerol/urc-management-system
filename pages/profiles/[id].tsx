import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { Avatar, Divider, Heading, HStack, Tag, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import { BookPublication, ExternalResearch, Institute, JournalPublication, Profile, ProfileToBookPublicationBridge, ProfileToExternalResearchBridge, ProfileToInstituteBridge, ProfileToJournalPublicationBridge, ProfileToProjectBridge, ProfileToResearchDisseminationBridge, ProfileToResearchPresentationBridge, Project, ResearchDissemination, ResearchPresentation, Unit, User } from '@prisma/client'
import Card from '../../components/Card'
import ProfileDetails from '../../components/profiles/profile/ProfileDetails'
import InternalProjects from '../../components/profiles/profile/InternalProjects'
import ExternalResearches from '../../components/profiles/profile/ExternalResearches'
import JournalPublications from '../../components/profiles/profile/JournalPublications'
import BookPublications from '../../components/profiles/profile/BookPublications'
import ResearchDisseminations from '../../components/profiles/profile/ResearchDisseminations'
import ResearchPresentations from '../../components/profiles/profile/ResearchPresentations'

interface ProfileProps {

}

const Profile: React.FC<ProfileProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const profile: Profile & {
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
  } = JSON.parse(props.profile)

  return (
    <>
      <NextSeo
        title={`${profile.first_name ?? profile.email} ${profile.last_name} | URC Management System`}
      />
      <VStack spacing={5}>
        <ContentHeader>
          {profile.first_name ?? profile.email} {profile.last_name}
        </ContentHeader>
        <VStack spacing={5} w="full">
          <ProfileDetails profile={profile} />
          <InternalProjects profile={profile} />
          <ExternalResearches profile={profile} />
          <JournalPublications profile={profile} />
          <BookPublications profile={profile} />
          <ResearchDisseminations profile={profile} />
          <ResearchPresentations profile={profile} />
        </VStack>
      </VStack>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const { query: { id } } = context

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: id as string
    },
    include: {
      user: true,
      units: true
    }
  })


  return {
    props: { 
      session,
      profile: JSON.stringify(profile)
    }
  }
}

export default Profile
