import React from 'react'
import { VStack, Heading, useToast, SimpleGrid } from '@chakra-ui/react'

import type { Submission, SubmissionTypes } from '@prisma/client'
import Card from '../../general/Card'
import ButtonWithConfirmation from '../../general/ButtonWithConfirmation'
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons'

interface ActionsProps {
  submission: Submission
}

const Actions: React.FC<ActionsProps> = (props) => {
  const toast = useToast()

  const [status, setStatus] = React.useState(props.submission.status)
  const [submitting, setSubmitting] = React.useState(false)

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

  const doAction = async (approved: boolean) => {
    setSubmitting(true)
    const res: { success: boolean, data: Submission } | { error: string } = await fetch(`/api/management/submissions/${props.submission.id}/actions`, {
      method: 'POST',
      body: JSON.stringify({ approved })
    }).then((i) => i.json())

    if ('success' in res) {
      setStatus(res.data.status)
      toast({
        title: 'Success!',
        description: `Successfully ${res.data.status === 'APPROVED' ? 'approved' : 'rejected'} submission!`,
        status: 'success'
      })
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }
    setSubmitting(false)
  }

  return (
    <VStack align="baseline" w="full" spacing={4}>
      <Heading fontFamily="body" fontSize="lg">
        Actions
      </Heading>
      <Card>
        <SimpleGrid columns={status === 'NOT_PROCESSED' ? 2 : 1} spacing={2}>
          { status !== 'APPROVED' && (
            <ButtonWithConfirmation
              color="white"
              bgColor="brand.blue"
              borderRadius={10}
              leftIcon={<CheckIcon />}
              _hover={{
                color: 'brand.blue',
                bgColor: 'brand.cardBackground'
              }}
              confirmationMessage={
                `
                  Press confirm to mark the <u>${humanizeType(props.submission.type)}</u> as <b>APPROVED</b>
                `
              }
              onClick={() => { doAction(true) }}
              isLoading={submitting}
            >
              Mark as Approved
            </ButtonWithConfirmation>
          ) }
          { status !== 'NOT_APPROVED' && (
            <ButtonWithConfirmation
              color="white"
              bgColor="brand.red"
              borderRadius={10}
              leftIcon={<DeleteIcon />}
              _hover={{
                color: 'brand.red',
                bgColor: 'brand.cardBackground'
              }}
              confirmationMessage={
                `
                  Press confirm to mark the <u>${humanizeType(props.submission.type)}</u> as <b>REJECTED</b>
                `
              }
              onClick={() => { doAction(false) }}
              isLoading={submitting}
            >
              Mark as Rejected
            </ButtonWithConfirmation>
          ) }
        </SimpleGrid>
      </Card>
    </VStack>
  )
}

export default Actions