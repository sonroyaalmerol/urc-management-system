import React from 'react'
import { VStack, Heading, Text } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { FullBlownProposalSubmission } from '@prisma/client'
import Card from '../../general/Card'
import RichTextarea from '../../general/RichTextarea'

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'

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
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="full" align="baseline" spacing={8}>
      <Card>
        <VStack align="baseline" spacing={6}>
          <Heading fontFamily="body" fontSize="lg">
            {props.projectTitle}
          </Heading>
          <FileUploadButton file={file} {...register('file')} />
          <VStack w="full" align="baseline" spacing={1}>
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

export default FullBlownProposalForm