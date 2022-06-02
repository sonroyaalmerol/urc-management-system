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
import type { Profile } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../utils/roleChecker'

interface NewProfileButtonProps {
  onSuccess: () => any
}

const NewProfileButton: React.FC<NewProfileButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset } = useForm<Partial<Profile>>();
  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<Profile>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((i) => i.json())

    if (res.success) {
      toast({
        title: 'Success!',
        description: `Successfully created profile of "${res.data.email}"!`,
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

  if (!(roleChecker(session.data.profile, ['urc_chairperson', 'urc_staff']))) {
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
          <ModalHeader>New Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Email Address</Text>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">First Name</Text>
                <Controller
                  name="first_name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Middle Initial</Text>
                <Controller
                  name="middle_initial"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input {...field} />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Last Name</Text>
                <Controller
                  name="last_name"
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

export default NewProfileButton