import React from 'react'
import { VStack, Heading, Text,  Wrap, WrapItem, Tag } from '@chakra-ui/react'

import type { Submission, SubmissionStatus, DeliverableSubmission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, Profile, Project, SubmissionTypes, FileUpload } from '@prisma/client'
import Card from '../../general/Card'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import RichTextarea from '../../general/RichTextarea'
import { ExtendedSubmission } from '../../../types/profile-card'

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

interface CapsuleProposalProps {
  submission: ExtendedSubmission
}

const CapsuleProposal: React.FC<CapsuleProposalProps> = (props) => {
  const { control, handleSubmit } = useForm<Partial<CapsuleProposalSubmission>>();

  const onSubmit: SubmitHandler<Partial<CapsuleProposalSubmission>> = data => {
    console.log(data)
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="full" align="baseline" spacing={4}>
      <Wrap align="center" spacing={4}>
        <WrapItem>
          <Heading fontFamily="body" fontSize="lg">
            Details
          </Heading>
        </WrapItem>
      </Wrap>
      <Card>
        <VStack align="baseline" spacing={6}>
          { /* TODO: Research Thrust */ }
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

export default CapsuleProposal