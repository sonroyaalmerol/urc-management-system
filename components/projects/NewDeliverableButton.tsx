import React from 'react'

import { useDisclosure, Text, Input, VStack, useToast, Textarea } from '@chakra-ui/react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"

import Button from '../general/Button'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'
import type { Deliverable } from '@prisma/client'
import { useRouter } from 'next/router'
import DatePicker from '../general/DatePicker'

import ResizeTextarea from "react-textarea-autosize"
import useUUID from '../../lib/client/useUUID'

interface NewDeliverableButtonProps {
  projectSlug: string
}

const NewDeliverableButton: React.FC<NewDeliverableButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset } = useForm<Partial<Deliverable>>();
  const router = useRouter()
  const toast = useToast()

  const uuid = useUUID()

  const onSubmit: SubmitHandler<Partial<Deliverable>> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/${props.projectSlug}/deliverables`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      router.push(`/projects/${props.projectSlug}?key=${uuid}`)
      toast({
        title: 'Success!',
        description: 'Successfully added deliverable!',
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
    onClose()
  };

  return (
    <>
      <Button
        aria-label='New Deliverable'
        onClick={onOpen}
        leftIcon={<AddIcon />}
      >
        New Deliverable
      </Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New Deliverable</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Title</Text>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => 
                    <Input {...field}/>
                  }
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Description</Text>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => 
                    <Textarea
                      minH="unset"
                      overflow="hidden"
                      borderRadius={10}
                      w="full"
                      resize="none"
                      minRows={1}
                      as={ResizeTextarea}
                      {...field}
                    />
                  }
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Deadline</Text>
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => 
                    <DatePicker {...field} />
                  }
                />
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={submitting} colorScheme='blue' mr={3} type="submit">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NewDeliverableButton