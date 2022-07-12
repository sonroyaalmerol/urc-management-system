import React from 'react'
import { VStack, Heading, Text, Center, Spinner, Input, useToast, Wrap, WrapItem } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { ExternalResearch, JournalPublication, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'

import AutoCompleteInput from '../../general/AutoCompleteInput'
import fetchWithFile from '../../../utils/client/fetchWithFile'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import DatePicker from '../../general/DatePicker'

interface JournalPublicationFormProps {
  profileId?: string
}

const JournalPublicationForm: React.FC<JournalPublicationFormProps> = (props) => {
  const { watch, handleSubmit, register, control, setValue } = useForm<Partial<JournalPublication> & Partial<VerificationRequest> & { proof_files: FileList }>();

  const [exists, setExists] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()
  const { proof_files } = watch()
  const router = useRouter()
  const session = useSession()

  const onSubmit: SubmitHandler<Partial<ExternalResearch> & Partial<VerificationRequest> & { proof_files: FileList }> = async data => {
    setSubmitting(true)
    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/journal_publications`, {...data, profile_id: props?.profileId ?? session.data.profile.id})

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully created verification request!`,
        status: 'success'
      })
      
      if (props.profileId) {
        router.push(`/profiles/${props.profileId}`)
      } else {
        router.push(`/verifications`)
      }
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
              api={`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/journal_publications`}
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
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">ISSN</Text>
                <Input {...register('issn')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Journal</Text>
                <Input {...register('journal')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">URL</Text>
                <Input {...register('url')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Date Published</Text>
                <Controller
                  name="date_published"
                  control={control}
                  render={({ field }) => 
                    <DatePicker
                      {...field}
                    />
                  }
                />
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

export default JournalPublicationForm