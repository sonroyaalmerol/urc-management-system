import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

import { prisma } from '../../utils/server/prisma'

import type { Project, SubmissionTypes } from '@prisma/client'
import ExternalResearchForm from '../../components/verifications/forms/ExternalResearchForm'
import JournalPublicationForm from '../../components/verifications/forms/JournalPublicationForm'
import BookPublicationForm from '../../components/verifications/forms/BookPublicationForm'
import ResearchDisseminationForm from '../../components/verifications/forms/ResearchDisseminationForm'
import ResearchPresentationForm from '../../components/verifications/forms/ResearchPresentationForm'
import ResearchEventForm from '../../components/verifications/forms/ResearchEventForm'

interface NewSubmissionProps {

}

const NewVerification: React.FC<NewSubmissionProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { type, profileId } = props

  const humanizeType = (type: SubmissionTypes) => {
    switch(type.toUpperCase()) {
      case 'EXTERNAL_RESEARCH':
        return 'External Research'
      case 'JOURNAL_PUBLICATION':
        return 'Journal Publication'
      case 'BOOK_PUBLICATION':
        return 'Book Publication'
      case 'RESEARCH_DISSEMINATION':
        return 'Research Dissemination'
      case 'RESEARCH_PRESENTATION':
        return 'Research Presentation'
      case 'RESEARCH_EVENT':
        return 'Research Event'
    }
  }

  const formConstructor = (type: SubmissionTypes) => {
    switch(type.toUpperCase()) {
      case 'EXTERNAL_RESEARCH':
        return <ExternalResearchForm profileId={profileId as string} />
      case 'JOURNAL_PUBLICATION':
        return <JournalPublicationForm profileId={profileId as string} />
      case 'BOOK_PUBLICATION':
        return <BookPublicationForm profileId={profileId as string} />
      case 'RESEARCH_DISSEMINATION':
        return <ResearchDisseminationForm profileId={profileId as string} />
      case 'RESEARCH_PRESENTATION':
        return <ResearchPresentationForm profileId={profileId as string} />
      case 'RESEARCH_EVENT':
        return <ResearchEventForm profileId={profileId as string} />
    }
  }

  return (
    <>
      <NextSeo
        title={`${humanizeType(type)} Verification Request | URC Management System`}
      />
      <VStack spacing={5}>
        <ContentHeader>
          {humanizeType(type)}
        </ContentHeader>
        <VStack spacing={5} w="full">
          {formConstructor(type)}
        </VStack>
      </VStack>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const { params: { type } } = context

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  return {
    props: { 
      session,
      type: type as SubmissionTypes,
      profileId: context.query?.profile_id ?? null
    }
  }
}

export default NewVerification