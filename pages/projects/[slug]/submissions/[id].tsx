import React from 'react'
import ContentHeader from '../../../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, Heading, useToast, SimpleGrid } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../../utils/server/prisma'

import type {  Submission, SubmissionTypes } from '@prisma/client'

import Comments from '../../../../components/projects/submission/Comments'
import { ExtendedSubmission } from '../../../../types/profile-card'
import BudgetProposal from '../../../../components/projects/submission/BudgetProposal'
import CapsuleProposal from '../../../../components/projects/submission/CapsuleProposal'
import FullBlownProposal from '../../../../components/projects/submission/FullBlownProposal'
import Actions from '../../../../components/projects/submission/Actions'
import DeliverableSubmission from '../../../../components/projects/submission/DeliverableSubmission'
import { memberChecker, roleChecker } from '../../../../utils/roleChecker'
import { MANAGING_DELIVERABLES, REVIEW_PROPOSALS } from '../../../../utils/permissions'

interface SubmissionProps {
  
}

const Submission: React.FC<SubmissionProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const submission: ExtendedSubmission = JSON.parse(props.submission)

  const toast = useToast()

  const humanizeType = (type: SubmissionTypes) => {
    switch(type) {
      case 'BUDGET':
        return 'Budget Proposal'
      case 'CAPSULE':
        return 'Capsule Proposal'
      case 'DELIVERABLE':
        return 'Deliverable Submission'
      case 'FULL':
        return 'Full-blown Proposal'
    }
  }

  const formConstructor = (type: SubmissionTypes) => {
    switch(type) {
      case 'BUDGET':
        return <BudgetProposal
          submission={submission}
        />
      case 'CAPSULE':
        return <CapsuleProposal
          submission={submission}
        />
      case 'FULL':
        return <FullBlownProposal
          submission={submission}
        />
      case 'DELIVERABLE':
        return <DeliverableSubmission
          submission={submission}
        />
    }
  }

  return (
    <>
      <NextSeo
        title={`${humanizeType(submission.type)} - ${submission.project.title} | URC Management System`}
      />
      <VStack spacing={5}>
        <ContentHeader>
          {humanizeType(submission.type)}
        </ContentHeader>
        <VStack spacing={8} w="full">
          {formConstructor(submission.type)}

          <Actions submission={submission} />
          <Comments submission={submission} />
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
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  const submission = await prisma.submission.findUnique({
    where: {
      id: id as string,
    },
    include: {
      deliverable_submission: {
        include: {
          deliverable: true
        }
      },
      budget_proposal_submission: true,
      capsule_proposal_submission: true,
      full_blown_proposal_submission: true,
      profile: true,
      project: {
        include: {
          bridge_profiles: true
        }
      },
      files: true,
      comments: {
        include: {
          profile: true
        }
      }
    }
  })
  
  if (submission.type === 'DELIVERABLE') {
    if (!roleChecker(session.profile, MANAGING_DELIVERABLES) && !memberChecker(session.profile, submission.project.bridge_profiles)) {
      return {
        props: {
          statusCode: 401
        }
      }
    }
  } else {
    if (!roleChecker(session.profile, REVIEW_PROPOSALS) && !memberChecker(session.profile, submission.project.bridge_profiles)) {
      return {
        props: {
          statusCode: 401
        }
      }
    }
  }

  if (!submission) {
    return {
      props: {
        statusCode: 404
      }
    }
  }

  return {
    props: { 
      session,
      submission: JSON.stringify(submission)
    }
  }
}

export default Submission