import React from 'react'
import { VStack, Heading, Text, Center, Spinner } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { ExternalResearch, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { Controller, useForm, SubmitHandler } from "react-hook-form"
import AutoCompleteInput from '../../general/AutoCompleteInput'


interface ExternalResearchFormProps {
}

const ExternalResearchForm: React.FC<ExternalResearchFormProps> = (props) => {
  const { control, handleSubmit, register, watch, setValue } = useForm<Partial<ExternalResearch> & Partial<VerificationRequest>>();

  const onSubmit: SubmitHandler<Partial<ExternalResearch> & Partial<VerificationRequest>> = data => {
    console.log(data)
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
              formWatch={watch}
              formSetValue={setValue}
            />
            <Text fontStyle="italic" fontSize="xs" pl="1rem">
              Existing entries will be showed.
            </Text>
          </VStack>
          <Button type="submit">Submit</Button>
        </VStack>
      </Card>
    </VStack>
  )
}

export default ExternalResearchForm