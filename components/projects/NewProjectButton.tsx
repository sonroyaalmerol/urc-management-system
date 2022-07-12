import React from 'react'

import { useDisclosure, Text, Input, VStack, useToast } from '@chakra-ui/react'
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
import type { Project } from '@prisma/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../utils/roleChecker'
import { CREATE_PROJECT } from '../../utils/permissions'

interface NewProjectButtonProps {
  onSuccess: () => any
}

const NewProjectButton: React.FC<NewProjectButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit, reset } = useForm<Partial<Project>>()
  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<Project>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects`, {
      method: 'POST',
      body: JSON.stringify({...data, mode: 'create'})
    }).then((i) => i.json())

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully created project "${res.data.title}"!`,
        status: 'success'
      })
      props.onSuccess()
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }
    setSubmitting(false)
    reset()
    onClose()
  };

  const session = useSession()

  if (!(roleChecker(session.data.profile, CREATE_PROJECT))) {
    return <></>
  }

  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<AddIcon />}
      >
        New
      </Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Project Title</Text>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input {...field} />}
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

export default NewProjectButton