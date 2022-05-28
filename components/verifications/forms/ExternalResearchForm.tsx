import React from 'react'
import { VStack, Heading, Text, Center, Spinner, Input, useToast } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { ExternalResearch, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { Controller, useForm, SubmitHandler } from "react-hook-form"
import AutoCompleteInput from '../../general/AutoCompleteInput'


interface ExternalResearchFormProps {
}

const ExternalResearchForm: React.FC<ExternalResearchFormProps> = (props) => {
  const { control, handleSubmit, register, reset, setValue } = useForm<Partial<ExternalResearch> & Partial<VerificationRequest>>();

  const [exists, setExists] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<ExternalResearch> & Partial<VerificationRequest>> = async data => {
    setSubmitting(true)
    const res = await fetch(`/api/management/verifications/external_researches`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully created verification request!`,
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
              api="/api/management/verifications/external_researches"
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
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Organization</Text>
                <Input {...register('organization')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Duration</Text>
                <Input {...register('duration')} />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Cycle</Text>
                <Input {...register('cycle')} />
              </VStack>
            </>
          ) }
          <Button type="submit" isLoading={submitting}>Submit</Button>
        </VStack>
      </Card>
    </VStack>
  )
}

export default ExternalResearchForm