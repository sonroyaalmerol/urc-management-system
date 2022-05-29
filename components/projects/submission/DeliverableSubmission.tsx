import React from 'react'
import { VStack, Heading, Text, Wrap, WrapItem, Spacer } from '@chakra-ui/react'

import type { DeliverableSubmission as DeliverableSubmissionType } from '@prisma/client'
import Card from '../../general/Card'

import FileDetails from '../../general/FileDetails'
import { Controller, useForm } from 'react-hook-form'
import RichTextarea from '../../general/RichTextarea'
import { ExtendedSubmission } from '../../../types/profile-card'
import { format } from 'date-fns'

interface DeliverableSubmissionProps {
  submission: ExtendedSubmission
}

const DeliverableSubmission: React.FC<DeliverableSubmissionProps> = (props) => {
  const { control } = useForm<Partial<DeliverableSubmissionType>>();

  return (
    <VStack w="full" spacing={8}>
      <VStack align="baseline" spacing={4} w="full">
        <Heading fontFamily="body" fontSize="lg">
          Deliverable Details
        </Heading>
        <Card>
          <VStack align="baseline" spacing={4}>
            <VStack
              alignItems="flex-start"
              spacing={1}
              h="full"
            >
              <Heading
                size="sm"
                fontFamily="body"
                textAlign="left"
              >
                {props.submission.deliverable_submission.deliverable.title}
              </Heading>
              <Text overflowWrap="anywhere">
                {props.submission.deliverable_submission.deliverable.description}
              </Text>
              <Spacer />
              <Text fontSize="sm" fontStyle="italic">
                {format(new Date(props.submission.deliverable_submission.deliverable.deadline), 'MMM dd, yyyy')}
              </Text>
            </VStack>
          </VStack>
        </Card>
      </VStack>
      <VStack align="baseline" spacing={4} w="full">
        <Heading fontFamily="body" fontSize="lg">
          Files Uploaded
        </Heading>
        <Card>
          <VStack align="baseline" spacing={4}>
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
                defaultValue={props.submission.deliverable_submission.description}
                render={({ field }) => <RichTextarea isReadOnly {...field} />}
              />
            </VStack>
          </VStack>
        </Card>
      </VStack>
    </VStack>
  )
}

export default DeliverableSubmission