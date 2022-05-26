import React from 'react'
import ContentHeader from '../../../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, Heading, Text, HStack, Avatar, Wrap, WrapItem, Tag, Textarea } from '@chakra-ui/react'

import Button from '../../../../components/Button'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../../lib/server/prisma'

import type { Comment, Submission, SubmissionStatus, DeliverableSubmission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, Profile, Project, SubmissionTypes } from '@prisma/client'
import Card from '../../../../components/Card'
import RichTextarea from '../../../../components/RichTextarea'

import { useForm, Controller, SubmitHandler } from "react-hook-form"

const humanizeStatus = (status: SubmissionStatus) => {
  switch(status) {
    case 'APPROVED':
      return {
        color: 'brand.blue',
        text: 'Approved'
      }
    case 'NOT_APPROVED':
      return {
        color: 'brand.red',
        text: 'Not Approved'
      }
    case 'NOT_PROCESSED':
      return {
        color: 'brand.lightBlue',
        text: 'Not yet processed'
      }
  }
}
interface CapsuleProposalFormProps {
  projectTitle: string,
  submission: CapsuleProposalSubmission,
  status: SubmissionStatus
}

const CapsuleProposalForm: React.FC<CapsuleProposalFormProps> = (props) => {
  const { control, handleSubmit } = useForm<Partial<CapsuleProposalSubmission>>();

  const onSubmit: SubmitHandler<Partial<CapsuleProposalSubmission>> = data => {
    console.log(data)
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="full" align="baseline" spacing={8}>
      <Card>
        <VStack align="baseline" spacing={6}>
          <Wrap align="center" spacing={4}>
            <WrapItem>
              <Heading fontFamily="body" fontSize="lg">
                {props.projectTitle}
              </Heading>
            </WrapItem>
            <WrapItem>
              <Tag
                bgColor={humanizeStatus(props.status).color}
                textColor="white"
                borderRadius="20px"
                fontSize="xs"
                fontWeight="bold"
                paddingX="0.8rem"
              >
                {humanizeStatus(props.status).text}
              </Tag>
            </WrapItem>
          </Wrap>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Research Thrust</Text>
            <Controller
              name="research_thrust"
              control={control}
              defaultValue={props.submission.research_thrust}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Brief Background</Text>
            <Controller
              name="brief_background"
              control={control}
              defaultValue={props.submission.brief_background}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Objectives of the Study / Statement of the Problem</Text>
            <Controller
              name="objectives_of_the_study"
              control={control}
              defaultValue={props.submission.objectives_of_the_study}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Significance of the Study</Text>
            <Controller
              name="significance_of_the_study"
              control={control}
              defaultValue={props.submission.significance_of_the_study}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Methodology</Text>
            <Controller
              name="methodology"
              control={control}
              defaultValue={props.submission.methodology}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
        </VStack>
      </Card>
    </VStack>
  )
}

interface FullBlownProposalFormProps {
  projectTitle: string,
  submission: FullBlownProposalSubmission,
  status: SubmissionStatus
}

const FullBlownProposalForm: React.FC<FullBlownProposalFormProps> = () => {
  return (
    <>
    </>
  )
}

interface BudgetProposalFormProps {
  projectTitle: string,
  submission: BudgetProposalSubmission,
  status: SubmissionStatus
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

  const { control, handleSubmit } = useForm<Partial<Comment>>();

  const onSubmit: SubmitHandler<Partial<Comment>> = data => {
    console.log(data)
  };

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
        return <BudgetProposalForm
          projectTitle={submission.project.title}
          submission={submission.budget_proposal_submission}
          status={submission.status}
        />
      case 'CAPSULE':
        return <CapsuleProposalForm
          projectTitle={submission.project.title}
          submission={submission.capsule_proposal_submission}
          status={submission.status}
        />
      case 'FULL':
        return <FullBlownProposalForm
          projectTitle={submission.project.title}
          submission={submission.full_blown_proposal_submission}
          status={submission.status}
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
        <VStack spacing={5} w="full">
          {formConstructor(submission.type)}
          
          <Card>
            <VStack align="baseline" spacing={6}>
              <Heading fontFamily="body" fontSize="lg">
                Comments
              </Heading>
              <HStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4} w="full" align="flex-start">
                <Avatar />
                <VStack align="end" spacing={1} w="full">
                  <Controller
                    name="content"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => <Textarea {...field} />}
                  />
                  <Button type="submit">Comment</Button>
                </VStack>
              </HStack>

              <HStack spacing={4} w="full" align="flex-start">
                <Avatar />
                <VStack align="baseline" spacing={1} w="full">
                  <Heading fontFamily="body" fontSize="md" color="brand.blue">Son Roy Almerol</Heading>
                  <Text>This is the comment.</Text>
                </VStack>
              </HStack>

              <HStack spacing={4} w="full" align="flex-start">
                <Avatar />
                <VStack align="baseline" spacing={1} w="full">
                  <Heading fontFamily="body" fontSize="md" color="brand.blue">Son Roy Almerol</Heading>
                  <Text>This</Text>
                  <Text>is</Text>
                  <Text>a</Text>
                  <Text>multiline</Text>
                  <Text>comment</Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
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
      id: id as string,
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