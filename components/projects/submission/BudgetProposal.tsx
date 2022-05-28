import React from 'react'
import { VStack, Heading, Text, HStack, Avatar, Wrap, WrapItem, Tag, Textarea, useToast, SimpleGrid } from '@chakra-ui/react'

import type { Comment, Submission, SubmissionStatus, DeliverableSubmission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, Profile, Project, SubmissionTypes, FileUpload } from '@prisma/client'
import Card from '../../general/Card'

import FileDetails from '../../general/FileDetails'
import { ExtendedSubmission } from '../../../types/profile-card'

interface BudgetProposalProps {
  submission: ExtendedSubmission
}

const BudgetProposal: React.FC<BudgetProposalProps> = (props) => {
  return (
    <VStack align="baseline" spacing={4} w="full">
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
      </Card>
    </VStack>
  )
}

export default BudgetProposal