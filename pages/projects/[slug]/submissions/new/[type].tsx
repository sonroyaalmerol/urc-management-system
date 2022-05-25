import React from 'react'
import ContentHeader from '../../../../../components/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import { VStack, HStack, Heading, Wrap, WrapItem, Spacer, Select, Input, Text, Box } from '@chakra-ui/react'

import Button from '../../../../../components/Button'

import { AddIcon, AttachmentIcon } from '@chakra-ui/icons'

import { NextSeo } from 'next-seo'

import { prisma } from '../../../../../lib/server/prisma'

import type { Submission, DeliverableSubmission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, Profile, Project, SubmissionTypes } from '@prisma/client'
import Card from '../../../../../components/Card'
import RichTextarea from '../../../../../components/RichTextarea'

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import formatBytes from '../../../../../lib/formatBytes'
import FileUploadButton from '../../../../../components/FileUploadButton'

interface CapsuleProposalFormProps {
  projectTitle: string,
}

const CapsuleProposalForm: React.FC<CapsuleProposalFormProps> = (props) => {
  const { control, handleSubmit } = useForm<Partial<CapsuleProposalSubmission>>();

  const onSubmit: SubmitHandler<Partial<CapsuleProposalSubmission>> = data => {
    console.log(data)
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="100%" align="baseline" spacing={8}>
      <Card>
        <VStack align="baseline" spacing={6}>
          <Heading fontFamily="body" fontSize="lg">
            {props.projectTitle}
          </Heading>
          <VStack w="100%" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Research Thrust</Text>
            <Controller
              name="research_thrust"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="100%" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Brief Background</Text>
            <Controller
              name="brief_background"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="100%" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Objectives of the Study / Statement of the Problem</Text>
            <Controller
              name="objectives_of_the_study"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="100%" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Significance of the Study</Text>
            <Controller
              name="significance_of_the_study"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="100%" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Methodology</Text>
            <Controller
              name="methodology"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <Button type="submit">Submit</Button>
        </VStack>
      </Card>
    </VStack>
  )
}

interface FullBlownProposalFormProps {
  projectTitle: string,
}

const FullBlownProposalForm: React.FC<FullBlownProposalFormProps> = (props) => {
  const { control, handleSubmit, register, watch } = useForm<Partial<FullBlownProposalSubmission & { file: FileList }>>();

  const onSubmit: SubmitHandler<Partial<FullBlownProposalSubmission>> = data => {
    console.log(data)
  };

  const { file } = watch()

  React.useEffect(() => {
    console.log(file)
  }, [file])

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="100%" align="baseline" spacing={8}>
      <Card>
        <VStack align="baseline" spacing={6}>
          <Heading fontFamily="body" fontSize="lg">
            {props.projectTitle}
          </Heading>
          <FileUploadButton file={file} {...register('file')} />
          <VStack w="100%" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Description</Text>
            <Controller
              name="description"
              control={control}
              defaultValue={""}
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <Button type="submit">Submit</Button>
        </VStack>
      </Card>
    </VStack>
  )
}

interface BudgetProposalFormProps {
  projectTitle: string,
}

const BudgetProposalForm: React.FC<BudgetProposalFormProps> = (props) => {
  const { control, handleSubmit, register, watch } = useForm<Partial<BudgetProposalSubmission & { file: FileList }>>();

  const onSubmit: SubmitHandler<Partial<BudgetProposalSubmission>> = data => {
    console.log(data)
  };

  const { file } = watch()

  React.useEffect(() => {
    console.log(file)
  }, [file])

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="100%" align="baseline" spacing={8}>
      <Card>
        <VStack align="baseline" spacing={6}>
          <Heading fontFamily="body" fontSize="lg">
            {props.projectTitle}
          </Heading>
          <FileUploadButton file={file} {...register('file')} />
          <Button type="submit">Submit</Button>
        </VStack>
      </Card>
    </VStack>
  )
}

interface NewSubmissionProps {

}

const NewSubmission: React.FC<NewSubmissionProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const project: Project = JSON.parse(props.project)

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
        return <BudgetProposalForm projectTitle={project.title} />
      case 'CAPSULE':
        return <CapsuleProposalForm projectTitle={project.title} />
      case 'FULL':
        return <FullBlownProposalForm projectTitle={project.title} />
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

  console.log(context.params)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const project = await prisma.project.findUnique({
    where: {
      slug: slug as string
    }
  })

  return {
    props: { 
      session,
      project: JSON.stringify(project),
      type: type as SubmissionTypes
    }
  }
}

export default NewSubmission