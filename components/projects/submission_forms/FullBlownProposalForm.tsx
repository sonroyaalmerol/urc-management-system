import React from 'react'
import { VStack, Heading, Text, useToast, Wrap, WrapItem } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { FullBlownProposalSubmission, Submission } from '@prisma/client'
import Card from '../../general/Card'
import RichTextarea from '../../general/RichTextarea'

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'
import fetchWithFile from '../../../lib/client/fetchWithFile'
import { useRouter } from 'next/router'

interface FullBlownProposalFormProps {
  projectTitle: string,
  projectId: string
  projectSlug: string
}

const FullBlownProposalForm: React.FC<FullBlownProposalFormProps> = (props) => {
  const { control, handleSubmit, register, watch, setValue, reset } = useForm<Partial<Submission & FullBlownProposalSubmission & { file: FileList }>>();
  const toast = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit: SubmitHandler<Partial<Submission & FullBlownProposalSubmission>> = async data => {
    setSubmitting(true)
    const res = await fetchWithFile(`/api/management/projects/${props.projectId}`, { ...data, type: 'FULL' })

    if (res.success) {
      router.push(`/projects/${props.projectSlug}`)
      toast({
        title: 'Success!',
        description: `Successfully created Full-blown Proposal!`,
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
          <FileUploadButton files={file} {...register('file')} />
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Description</Text>
            <Controller
              name="description"
              control={control}
              defaultValue={""}
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <Wrap spacing={4}>
            <WrapItem>
              <Button type="submit" isLoading={submitting}>Submit</Button>
            </WrapItem>
            <WrapItem>
              <Button isLoading={submitting} variant="ghost" onClick={() => router.back()}>Cancel</Button>
            </WrapItem>
          </Wrap>
        </VStack>
      </Card>
    </VStack>
  )
}

export default FullBlownProposalForm