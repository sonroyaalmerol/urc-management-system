import React from 'react'
import { VStack, Heading, Text, useToast, Wrap, WrapItem } from '@chakra-ui/react'

import Button from '../../general/Button'

import type { CapsuleProposalSubmission, Submission } from '@prisma/client'
import Card from '../../general/Card'
import RichTextarea from '../../general/RichTextarea'

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import fetchWithFile from '../../../utils/client/fetchWithFile'
import { useRouter } from 'next/router'
import { ExtendedProject } from '../../../types/profile-card'

interface CapsuleProposalFormProps {
  project: Partial<ExtendedProject>
}

const CapsuleProposalForm: React.FC<CapsuleProposalFormProps> = (props) => {
  const { control, handleSubmit, setValue, reset } = useForm<Partial<Submission & CapsuleProposalSubmission>>();
  const toast = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit: SubmitHandler<Partial<Submission & CapsuleProposalSubmission>> = async data => {
    setValue('type', 'CAPSULE')
    setSubmitting(true)
    const res = await fetchWithFile(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/${props.project.id}`, { ...data, type: 'CAPSULE' })

    if (res.success) {
      router.push(`/projects/${props.project.slug}`)
      toast({
        title: 'Success!',
        description: `Successfully created Capsule Proposal!`,
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
            {props.project.title}
          </Heading>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Research Thrust</Text>
            <Controller
              name="research_thrust"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Brief Background</Text>
            <Controller
              name="brief_background"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Objectives of the Study / Statement of the Problem</Text>
            <Controller
              name="objectives_of_the_study"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Significance of the Study</Text>
            <Controller
              name="significance_of_the_study"
              control={control}
              defaultValue=""
              render={({ field }) => <RichTextarea {...field} />}
            />
          </VStack>
          <VStack w="full" align="baseline" spacing={1}>
            <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Methodology</Text>
            <Controller
              name="methodology"
              control={control}
              defaultValue=""
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

export default CapsuleProposalForm