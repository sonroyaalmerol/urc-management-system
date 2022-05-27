import React from 'react'
import { VStack, Heading } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { BudgetProposalSubmission } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'


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
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="full" align="baseline" spacing={8}>
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

export default BudgetProposalForm