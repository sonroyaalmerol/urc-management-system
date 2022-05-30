import React from 'react'
import { VStack, HStack, Avatar, Text, Tag, Button, Wrap, WrapItem, Box, Center, Spinner, BoxProps } from '@chakra-ui/react'

import Card from '../general/Card'

import type { Profile, Submission, BudgetProposalSubmission, CapsuleProposalSubmission, FullBlownProposalSubmission, DeliverableSubmission, FileUpload, User, SubmissionTypes, SubmissionStatus, Project, Deliverable } from '@prisma/client'

import { format } from 'date-fns'

import { useRouter } from 'next/router'
import parseHTML from '../../lib/client/parseHTML'
import FileDetails from '../general/FileDetails'

interface SubmissionCardProps extends BoxProps {
  submission: Partial<(Submission & {
    profile: Profile & {
        user: User;
    };
    capsule_proposal_submission: CapsuleProposalSubmission;
    full_blown_proposal_submission: FullBlownProposalSubmission;
    deliverable_submission: DeliverableSubmission & {
      deliverable: Deliverable;
    };
    budget_proposal_submission: BudgetProposalSubmission;
    files: FileUpload[];
    project: Project;
  })>
}

const SubmissionCard: React.FC<SubmissionCardProps> = (props) => {
  const { submission } = props

  const divProps = Object.assign({}, props)
  delete divProps.submission

  const humanizeType = (type: SubmissionTypes) => {
    switch(type) {
      case 'BUDGET':
        return 'Budget Proposal'
      case 'CAPSULE':
        return 'Capsule Proposal'
      case 'DELIVERABLE':
        return `Deliverable Submission for ${submission.deliverable_submission.deliverable.title}`
      case 'FULL':
        return 'Full-blown Proposal'
    }
  }

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

  const humanizeDescription = (submission: Partial<(Submission & {
    profile: Profile & {
        user: User;
    };
    capsule_proposal_submission: CapsuleProposalSubmission;
    full_blown_proposal_submission: FullBlownProposalSubmission;
    deliverable_submission: DeliverableSubmission;
    budget_proposal_submission: BudgetProposalSubmission;
    files: FileUpload[];
  })>) => {
    switch(submission.type) {
      case 'BUDGET':
      case 'DELIVERABLE':
      case 'FULL':
        return {
          title: 'Description:',
          content: submission.description
        }
      case 'CAPSULE':
        return {
          title: 'Brief Background:',
          content: submission.capsule_proposal_submission.brief_background
        }
    }
  }

  const router = useRouter()

  return (
    <Card
      as="a"
      href={`/projects/${submission.project.slug}/submissions/${submission.id}`}
      transition="box-shadow 0.05s, background-color 0.1s"
      _hover={{
        backgroundColor: "brand.cardBackground",
        boxShadow: "-5px 5px 30px -20px"
      }}
      _active={{
        boxShadow: "-5px 5px 20px -20px"
      }}
      onClick={(e) => {
        e.preventDefault()
        router.push(`/projects/${submission.project.slug}/submissions/${submission.id}`)
      }}
      {...divProps}
    >
      <VStack w="full" alignItems="flex-start" spacing={4}>
        <HStack spacing={4} align="flex-start">
          <Avatar src={`/api/files/get/${submission.profile.photo_id}`} size="sm" />
          <VStack align="flex-start">
            <Wrap>
              <WrapItem>
                <Text
                  fontWeight="bold"
                  color="brand.blue"
                >
                  { submission.profile.first_name }
                </Text>
              </WrapItem>
              <WrapItem>
                <Text fontStyle="italic">
                  submitted a {humanizeType(submission.type)}
                </Text>
              </WrapItem>
              <WrapItem>
                <Tag
                  bgColor={humanizeStatus(submission.status).color}
                  textColor="white"
                  borderRadius="20px"
                  fontSize="xs"
                  fontWeight="bold"
                  paddingX="0.8rem"
                >
                  {humanizeStatus(submission.status).text}
                </Tag>
              </WrapItem>
            </Wrap>
            { submission.type === 'CAPSULE' ? (
              <Wrap>
                <WrapItem>
                  <Text color="brand.blue" fontWeight="bold" fontStyle="italic" fontSize="sm">
                    { humanizeDescription(submission).title }
                  </Text>
                </WrapItem>
                <WrapItem>
                  <Text fontSize="sm">
                    { parseHTML(humanizeDescription(submission).content, { textOnly: true }) }
                  </Text>
                </WrapItem>
              </Wrap>
            ) : (
              <Wrap>
                { submission.files.map((file) => (
                  <WrapItem key={file.id}>
                    <FileDetails file={file} />
                  </WrapItem>
                )) }
              </Wrap>
            ) }
            
            <Text fontStyle="italic" color="brand.blue">
              { format(new Date(submission.updated_at), 'MMM dd, yyyy h:mm a') }
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  )
}

export default SubmissionCard