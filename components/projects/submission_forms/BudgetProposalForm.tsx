import React from 'react'
import { VStack, Heading, useToast } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { BudgetProposalSubmission, Submission } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'
import fetchWithFile from '../../../lib/client/fetchWithFile'
import { useRouter } from 'next/router'


interface BudgetProposalFormProps {
  projectTitle: string,
  projectId: string,
  projectSlug: string
}

const BudgetProposalForm: React.FC<BudgetProposalFormProps> = (props) => {
  const { handleSubmit, register, watch, reset, setValue } = useForm<Partial<BudgetProposalSubmission & { file: FileList } & Submission>>();
  const toast = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit: SubmitHandler<Partial<BudgetProposalSubmission>> = async data => {
    setSubmitting(true)
    const res = await fetchWithFile(`/api/management/projects/${props.projectId}`, { ...data, type: 'BUDGET' })

    if (res.success) {
      router.push(`/projects/${props.projectSlug}`)
      toast({
        title: 'Success!',
        description: `Successfully submitted Budget Proposal!`,
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
    reset()
  };

  const { file } = watch()

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="full" align="baseline" spacing={8}>
      <Card>
        <VStack align="baseline" spacing={6}>
          <Heading fontFamily="body" fontSize="lg">
            {props.projectTitle}
          </Heading>
          <FileUploadButton file={file} {...register('file')} />
          <Button type="submit" isLoading={submitting}>Submit</Button>
        </VStack>
      </Card>
    </VStack>
  )
}

export default BudgetProposalForm