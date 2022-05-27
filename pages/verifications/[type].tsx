import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

import { prisma } from '../../lib/server/prisma'

import type { Project, SubmissionTypes } from '@prisma/client'
import ExternalResearchForm from '../../components/verifications/forms/ExternalResearchForm'
import JournalPublicationForm from '../../components/verifications/forms/JournalPublicationForm'
import BookPublicationForm from '../../components/verifications/forms/BookPublicationForm'
import ResearchDisseminationForm from '../../components/verifications/forms/ResearchDisseminationForm'
import ResearchPresentationForm from '../../components/verifications/forms/ResearchPresentationForm'
import ResearchEventAttendanceForm from '../../components/verifications/forms/ResearchEventAttendanceForm'

interface NewSubmissionProps {

}

const NewVerification: React.FC<NewSubmissionProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { type } = props

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
      case 'RESEARCH_EVENT_ATTENDANCE':
        return 'Research Event Attendance'
    }
  }

  const formConstructor = (type: SubmissionTypes) => {
    switch(type.toUpperCase()) {
      case 'EXTERNAL_RESEARCH':
        return <ExternalResearchForm />
      case 'JOURNAL_PUBLICATION':
        return <JournalPublicationForm />
      case 'BOOK_PUBLICATION':
        return <BookPublicationForm />
      case 'RESEARCH_DISSEMINATION':
        return <ResearchDisseminationForm />
      case 'RESEARCH_PRESENTATION':
        return <ResearchPresentationForm />
      case 'RESEARCH_EVENT_ATTENDANCE':
        return <ResearchEventAttendanceForm />
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
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { 
      session,
      type: type as SubmissionTypes
    }
  }
}

export default NewVerification