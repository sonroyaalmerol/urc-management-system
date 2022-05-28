import React from 'react'
import { VStack, Heading, Text, Wrap, WrapItem } from '@chakra-ui/react'

import type { Submission, DeliverableSubmission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, Profile, Project, FileUpload } from '@prisma/client'
import Card from '../../general/Card'

import FileDetails from '../../general/FileDetails'
import { Controller, useForm } from 'react-hook-form'
import RichTextarea from '../../general/RichTextarea'
import { ExtendedSubmission } from '../../../types/profile-card'

interface FullBlownProposalProps {
  submission: ExtendedSubmission
}

const FullBlownProposal: React.FC<FullBlownProposalProps> = (props) => {
  const { control } = useForm<Partial<FullBlownProposalSubmission>>();

  return (
    <VStack align="baseline" spacing={4}>
      <Heading fontFamily="body" fontSize="lg">
        Files Uploaded
      </Heading>
      <Card>
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
      </Card>
    </VStack>
  )
}

export default FullBlownProposal