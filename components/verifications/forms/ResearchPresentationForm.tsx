import React from 'react'
import { VStack, Heading, Text, Center, Spinner, Input, useToast, Wrap, WrapItem } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { ExternalResearch, ResearchPresentation, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler } from "react-hook-form"

import AutoCompleteInput from '../../general/AutoCompleteInput'
import fetchWithFile from '../../../utils/client/fetchWithFile'
import FileUploadButton from '../../general/FileUploadButton'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface ResearchPresentationFormProps {
  profileId?: string
}

const ResearchPresentationForm: React.FC<ResearchPresentationFormProps> = (props) => {
  const { watch, handleSubmit, register, reset, setValue } = useForm<Partial<ResearchPresentation> & Partial<VerificationRequest> & { proof_files: FileList }>();

  const [exists, setExists] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()
  const { proof_files } = watch()
  const router = useRouter()
  const session = useSession()

  const onSubmit: SubmitHandler<Partial<ExternalResearch> & Partial<VerificationRequest> & { proof_files: FileList }> = async data => {
    setSubmitting(true)
    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/research_presentations`, {...data, profile_id: props?.profileId ?? session.data.profile.id})

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
              api={`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/research_presentations`}
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
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Location</Text>
                <Input {...register('location')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Event Date</Text>
                <Input {...register('event_date')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Conference</Text>
                <Input {...register('conference')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">URL</Text>
                <Input {...register('url')} />
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

export default ResearchPresentationForm