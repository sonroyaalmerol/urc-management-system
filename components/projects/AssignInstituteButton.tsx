import React, { useId } from 'react'

import { useDisclosure, Text, Input, VStack, Icon, Flex, Avatar, Box, Center, Spinner, useToast } from '@chakra-ui/react'
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

import { MdAssignmentInd } from 'react-icons/md'
import type { Profile, ProfileToProjectBridge, Project } from '@prisma/client'
import IconButton from '../general/IconButton'

import { useDebounce } from 'use-debounce'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import AutoCompleteInput from '../general/AutoCompleteInput'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../utils/roleChecker'

interface AssignInstituteButtonProps {
  projectId: string
}

interface FormFields { 
  email: string,
  role: string
}

const AssignInstituteButton: React.FC<AssignInstituteButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit, reset, setValue, watch } = useForm<FormFields>();

  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()
  const key = useUUID()
  const router = useRouter()

  const onSubmit: SubmitHandler<FormFields> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications/project_institute`, {
      method: 'POST',
      body: JSON.stringify({ ...data, project_id: props.projectId })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully submitted verification request for center involvement!',
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
    onClose()
  };

  const session = useSession()

  if (!(roleChecker(session.data.profile, ['researcher']))) {
    return <></>
  }

  return (
    <>
      <Button
        aria-label='Assign Institute'
        onClick={onOpen}
        leftIcon={<Icon as={MdAssignmentInd} w={6} h={6} />}
      >
        Assign Institute
      </Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Assign Institute/Center</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Institute/Center</Text>
                <AutoCompleteInput
                  api={`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes`}
                  name="name"
                  primaryDisplayName="short_name"
                  formSetValue={setValue}
                />
                <Text fontStyle="italic" fontSize="xs" pl="1rem">
                  Assignments are subject to approval from the center involved.
                </Text>
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

export default AssignInstituteButton