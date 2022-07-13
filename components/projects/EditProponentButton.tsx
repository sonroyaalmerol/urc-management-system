import React from 'react'

import { useDisclosure, Text, Input, VStack, Icon, useToast } from '@chakra-ui/react'
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

import { MdGroupAdd } from 'react-icons/md'
import type { Profile } from '@prisma/client'

import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import { memberChecker, roleChecker } from '../../utils/roleChecker'
import { useSession } from 'next-auth/react'
import { CHANGE_PROJECT_STATUS } from '../../utils/permissions'
import { ExtendedProject } from '../../types/profile-card'
import IconButton from '../general/IconButton'
import { EditIcon } from '@chakra-ui/icons'

interface EditProponentButtonProps {
  project: Partial<ExtendedProject>
  profile: Partial<Profile>
  role: string
}

interface FormFields { 
  email: string,
  role: string
}

const EditProponentButton: React.FC<EditProponentButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit, reset } = useForm<FormFields>();

  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()
  const key = useUUID()
  const router = useRouter()

  const onSubmit: SubmitHandler<FormFields> = async data => {
    setSubmitting(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects`, {
      method: 'POST',
      body: JSON.stringify({ ...data, mode: 'edit-proponent', id: props.project.id })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully edited proponent!',
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

  if (!roleChecker(session.data.profile, CHANGE_PROJECT_STATUS) && !memberChecker(session.data.profile, props.project.bridge_profiles)) {
    return <></>
  }

  return (
    <>
      <IconButton
        aria-label='Edit Proponent'
        onClick={onOpen}
        icon={<EditIcon />}
      />
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit {props.profile.first_name} {props.profile.last_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Proponent Email</Text>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={props.profile.email}
                  render={({ field }) => <Input {...field} readOnly />}
                />
              </VStack>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Role Title</Text>
                <Controller
                  name="role"
                  control={control}
                  defaultValue={props.role}
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

export default EditProponentButton