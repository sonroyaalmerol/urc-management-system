import React from 'react'
import { VStack, Heading, Text, Input, useToast, Wrap, WrapItem } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { ExternalResearch, Institute, InstituteNews, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'

import fetchWithFile from '../../../utils/client/fetchWithFile'
import { useRouter } from 'next/router'
import RichTextarea from '../../general/RichTextarea'

interface InstituteNewsFormProps {
  institute: Institute
}

const InstituteNewsForm: React.FC<InstituteNewsFormProps> = (props) => {
  const { watch, handleSubmit, register, reset, control } = useForm<Partial<InstituteNews> & Partial<VerificationRequest> & { upload_files: FileList }>();

  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()
  const { upload_files } = watch()
  const router = useRouter()

  const onSubmit: SubmitHandler<Partial<ExternalResearch> & Partial<VerificationRequest> & { upload_files: FileList }> = async data => {
    setSubmitting(true)
    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/institute_news`, {...data, institute_id: props.institute.id})

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully created memo!`,
        status: 'success'
      })
      router.push(`/institutes/${props.institute.id}/news`)
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }
    setSubmitting(false)
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="full" align="baseline" spacing={8}>
      <Card>
        <VStack align="baseline" spacing={6}>
          <Heading fontFamily="body" fontSize="lg">
            New {props.institute.name} News & Updates
          </Heading>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Title</Text>
            <Input {...register('title')} />
          </VStack>

          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Content</Text>
            <Controller
              name="content"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>

          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Upload Files</Text>
            <FileUploadButton files={upload_files} {...register('upload_files')} />
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

export default InstituteNewsForm