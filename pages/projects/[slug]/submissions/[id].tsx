import React from 'react'
import ContentHeader from '../../../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, Heading, Text, HStack, Avatar, Wrap, WrapItem, Tag, Textarea } from '@chakra-ui/react'

import Button from '../../../../components/general/Button'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../../lib/server/prisma'

import type { Comment, Submission, SubmissionStatus, DeliverableSubmission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, Profile, Project, SubmissionTypes, FileUpload } from '@prisma/client'
import Card from '../../../../components/general/Card'
import RichTextarea from '../../../../components/general/RichTextarea'

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import FileDetails from '../../../../components/general/FileDetails'

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

interface ExtendedSubmission extends Submission {
  deliverable_submission: DeliverableSubmission;
  budget_proposal_submission: BudgetProposalSubmission;
  capsule_proposal_submission: CapsuleProposalSubmission;
  full_blown_proposal_submission: FullBlownProposalSubmission;
  profile: Profile;
  project: Project;
  files: FileUpload[];
}
interface CapsuleProposalFormProps {
  submission: ExtendedSubmission
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
                {props.submission.project.title}
              </Heading>
            </WrapItem>
            <WrapItem>
              <Tag
                bgColor={humanizeStatus(props.submission.status).color}
                textColor="white"
                borderRadius="20px"
                fontSize="xs"
                fontWeight="bold"
                paddingX="0.8rem"
              >
                {humanizeStatus(props.submission.status).text}
              </Tag>
            </WrapItem>
          </Wrap>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Research Thrust</Text>
            <Controller
              name="research_thrust"
              control={control}
              defaultValue={props.submission.capsule_proposal_submission.research_thrust}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Brief Background</Text>
            <Controller
              name="brief_background"
              control={control}
              defaultValue={props.submission.capsule_proposal_submission.brief_background}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Objectives of the Study / Statement of the Problem</Text>
            <Controller
              name="objectives_of_the_study"
              control={control}
              defaultValue={props.submission.capsule_proposal_submission.objectives_of_the_study}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Significance of the Study</Text>
            <Controller
              name="significance_of_the_study"
              control={control}
              defaultValue={props.submission.capsule_proposal_submission.significance_of_the_study}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Methodology</Text>
            <Controller
              name="methodology"
              control={control}
              defaultValue={props.submission.capsule_proposal_submission.methodology}
              render={({ field }) => <RichTextarea isReadOnly {...field} />}
            />
          </VStack>
        </VStack>
      </Card>
    </VStack>
  )
}

interface FullBlownProposalFormProps {
  submission: ExtendedSubmission
}

const FullBlownProposalForm: React.FC<FullBlownProposalFormProps> = (props) => {
  const { control } = useForm<Partial<FullBlownProposalSubmission>>();

  return (
    <Card>
      <VStack align="baseline" spacing={6}>
        <Heading fontFamily="body" fontSize="lg">
          Files Uploaded
        </Heading>
        <Wrap>
          { props.submission.files.map((file) => (
            <WrapItem key={file.id}>
              <FileDetails isViewable file={file} />
            </WrapItem>
          )) }
          </Wrap>
        <VStack w="full" align="baseline" spacing={1}>
          <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Description</Text>
          <Controller
            name="description"
            control={control}
            defaultValue={props.submission.full_blown_proposal_submission.description}
            render={({ field }) => <RichTextarea isReadOnly {...field} />}
          />
        </VStack>
      </VStack>
    </Card>
  )
}

interface BudgetProposalFormProps {
  submission: ExtendedSubmission
}

const BudgetProposalForm: React.FC<BudgetProposalFormProps> = (props) => {
  return (
    <Card>
      <VStack align="baseline" spacing={6} w="full">
        <Heading fontFamily="body" fontSize="lg">
          Files Uploaded
        </Heading>
        <Wrap>
          { props.submission.files.map((file) => (
            <WrapItem key={file.id}>
              <FileDetails isViewable file={file} />
            </WrapItem>
          )) }
        </Wrap>
      </VStack>
    </Card>
  )
}

interface SubmissionProps {
  
}

const Submission: React.FC<SubmissionProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const submission: ExtendedSubmission = JSON.parse(props.submission)

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
          submission={submission}
        />
      case 'CAPSULE':
        return <CapsuleProposalForm
          submission={submission}
        />
      case 'FULL':
        return <FullBlownProposalForm
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
      project: true,
      files: true
    }
  })

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