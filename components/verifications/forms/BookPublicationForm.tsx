import React from 'react'
import { VStack, Heading, Text, Center, Spinner, Input, useToast, Wrap, WrapItem } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { BookPublication, ExternalResearch, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler } from "react-hook-form"
import AutoCompleteInput from '../../general/AutoCompleteInput'
import fetchWithFile from '../../../lib/client/fetchWithFile'
import FileUploadButton from '../../general/FileUploadButton'
import { useRouter } from 'next/router'

interface BookPublicationFormProps {
}

const BookPublicationForm: React.FC<BookPublicationFormProps> = (props) => {
  const { watch, handleSubmit, register, reset, setValue } = useForm<Partial<BookPublication> & Partial<VerificationRequest> & { proof_files: FileList }>();

  const [exists, setExists] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()
  const { proof_files } = watch()
  const router = useRouter()

  const onSubmit: SubmitHandler<Partial<ExternalResearch> & Partial<VerificationRequest> & { proof_files: FileList }> = async data => {
    setSubmitting(true)
    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/book_publications`, data)

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully created verification request!`,
        status: 'success'
      })
      router.push(`/verifications`)
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
            Verification Form
          </Heading>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Title</Text>
            <AutoCompleteInput
              api={`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/book_publications`}
              name="title"
              formSetValue={setValue}
              watchExists={(x) => {
                setExists(x)
              }}
            />
            <Text fontStyle="italic" fontSize="xs" pl="1rem">
              Existing entries will be showed.
            </Text>
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Role/Position</Text>
            <Input {...register('role')} />
          </VStack>
          { !exists && (
            <>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Publisher</Text>
                <Input {...register('publisher')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">ISBN</Text>
                <Input {...register('isbn')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Date Published</Text>
                <Input {...register('date_published')} />
              </VStack>
            </>
          ) }
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Proof Upload</Text>
            <FileUploadButton files={proof_files} {...register('proof_files')} />
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

export default BookPublicationForm