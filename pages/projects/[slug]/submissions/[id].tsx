import React from 'react'
import ContentHeader from '../../../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Button, Wrap, WrapItem, Spacer, Select, Input } from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../../lib/server/prisma'

import type { Submission, DeliverableSubmission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, Profile, Project, SubmissionTypes } from '@prisma/client'
import Card from '../../../../components/Card'
import RichTextarea from '../../../../components/RichTextarea'

interface CapsuleProposalFormProps {
  projectTitle: string,
  submission: CapsuleProposalSubmission
}

const CapsuleProposalForm: React.FC<CapsuleProposalFormProps> = (props) => {
  const [test, setTest] = React.useState('')

  React.useEffect(() => {
    console.log(test)
  })

  return (
    <>
      <Card>
        <VStack align="baseline">
          <Heading fontFamily="body" fontSize="lg">
            {props.projectTitle}
          </Heading>
          <RichTextarea placeholder='test' onChange={(e) => { setTest(e.target.value) }} value={test} />
          <Input />
        </VStack>
      </Card>
    </>
  )
}

interface FullBlownProposalFormProps {
  projectTitle: string,
  submission: FullBlownProposalSubmission
}

const FullBlownProposalForm: React.FC<FullBlownProposalFormProps> = () => {
  return (
    <>
    </>
  )
}

interface BudgetProposalFormProps {
  projectTitle: string,
  submission: BudgetProposalSubmission
}

const BudgetProposalForm: React.FC<BudgetProposalFormProps> = () => {
  return (
    <>
    </>
  )
}

interface SubmissionProps {

}

const Submission: React.FC<SubmissionProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const submission: Submission & {
    deliverable_submission: DeliverableSubmission;
    budget_proposal_submission: BudgetProposalSubmission;
    capsule_proposal_submission: CapsuleProposalSubmission;
    full_blown_proposal_submission: FullBlownProposalSubmission;
    profile: Profile;
    project: Project;
  } = JSON.parse(props.submission)

  const humanizeType = (type: SubmissionTypes) => {
    switch(type) {
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
    switch(type) {
      case 'BUDGET':
        return <BudgetProposalForm projectTitle={submission.project.title} submission={submission.budget_proposal_submission} />
      case 'CAPSULE':
        return <CapsuleProposalForm projectTitle={submission.project.title} submission={submission.capsule_proposal_submission} />
      case 'FULL':
        return <FullBlownProposalForm projectTitle={submission.project.title} submission={submission.full_blown_proposal_submission} />
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
        <VStack spacing={5} w="full">
          {formConstructor(submission.type)}
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

  const submission = await prisma.submission.findUnique({
    where: {
      id: id as string
    },
    include: {
      deliverable_submission: true,
      budget_proposal_submission: true,
      capsule_proposal_submission: true,
      full_blown_proposal_submission: true,
      profile: true,
      project: true
    }
  })

  return {
    props: { 
      session,
      submission: JSON.stringify(submission)
    }
  }
}

export default Submission