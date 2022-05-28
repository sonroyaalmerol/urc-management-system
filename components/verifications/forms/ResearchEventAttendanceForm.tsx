import React from 'react'
import { VStack, Heading, Text, Center, Spinner } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { ExternalResearch, ResearchEventAttendance, VerificationRequest } from '@prisma/client'
import Card from '../../general/Card'

import { useForm, SubmitHandler } from "react-hook-form"
import FileUploadButton from '../../general/FileUploadButton'

import AutoCompleteInput from '../../general/AutoCompleteInput'

interface ResearchEventAttendanceFormProps {
}

const ResearchEventAttendanceForm: React.FC<ResearchEventAttendanceFormProps> = (props) => {
  const { control, handleSubmit, register, watch, setValue } = useForm<Partial<ResearchEventAttendance> & Partial<VerificationRequest>>();

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
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Event Name</Text>
            <AutoCompleteInput
              api="/api/management/verifications/research_event_attendances"
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

export default ResearchEventAttendanceForm