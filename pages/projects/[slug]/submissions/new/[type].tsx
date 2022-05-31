import React from 'react'
import ContentHeader from '../../../../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../../../lib/server/prisma'

import type { Deliverable, Project, SubmissionTypes } from '@prisma/client'
import BudgetProposalForm from '../../../../../components/projects/submission_forms/BudgetProposalForm'
import CapsuleProposalForm from '../../../../../components/projects/submission_forms/CapsuleProposalForm'
import FullBlownProposalForm from '../../../../../components/projects/submission_forms/FullBlownProposalForm'
import DeliverableForm from '../../../../../components/projects/submission_forms/DeliverableForm'

interface NewSubmissionProps {

}

const NewSubmission: React.FC<NewSubmissionProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const project: Project = JSON.parse(props.project)
  const deliverable: Deliverable = JSON.parse(props.deliverable)

  const { type } = props

  const humanizeType = (type: SubmissionTypes) => {
    switch(type.toUpperCase()) {
      case 'BUDGET':
        return 'Budget Proposal'
      case 'CAPSULE':
        return 'Capsule Proposal'
      case 'DELIVERABLE':
        return 'Deliverable'
      case 'FULL':
        return 'Full-blown Proposal'
    }
  }

  const formConstructor = (type: SubmissionTypes) => {
    switch(type.toUpperCase()) {
      case 'BUDGET':
        return <BudgetProposalForm projectTitle={project.title} projectId={project.id} projectSlug={project.slug} />
      case 'CAPSULE':
        return <CapsuleProposalForm projectTitle={project.title} projectId={project.id} projectSlug={project.slug} />
      case 'FULL':
        return <FullBlownProposalForm projectTitle={project.title} projectId={project.id} projectSlug={project.slug} />
      case 'DELIVERABLE':
        return <DeliverableForm projectTitle={project.title} projectId={project.id} projectSlug={project.slug} deliverable={deliverable} />
    }
  }

  return (
    <>
      <NextSeo
        title={`New ${humanizeType(type)} - ${project.title} | URC Management System`}
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

  const { params: { slug, type } } = context

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  const project = await prisma.project.findUnique({
    where: {
      slug: slug as string
    }
  })

  const deliverable = await prisma.deliverable.findUnique({
    where: {
      id: context.query?.deliverable_id as string
    }
  })

  return {
    props: { 
      session,
      project: JSON.stringify(project),
      type: type as SubmissionTypes,
      deliverable: JSON.stringify(deliverable)
    }
  }
}

export default NewSubmission