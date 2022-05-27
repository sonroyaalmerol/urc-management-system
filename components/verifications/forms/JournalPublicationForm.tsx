import React from 'react'
import { VStack, Heading } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { ExternalResearch, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'


interface JournalPublicationFormProps {
}

const JournalPublicationForm: React.FC<JournalPublicationFormProps> = (props) => {
  const { control, handleSubmit, register, watch } = useForm<Partial<ExternalResearch> & Partial<VerificationRequest>>();

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
          <Button type="submit">Submit</Button>
        </VStack>
      </Card>
    </VStack>
  )
}

export default JournalPublicationForm