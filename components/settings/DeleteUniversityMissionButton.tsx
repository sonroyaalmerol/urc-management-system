import React from 'react'

import { useDisclosure, Text, Input, VStack, useToast, Checkbox, Switch } from '@chakra-ui/react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import type { Institute, ProfileToInstituteBridge, Unit } from '@prisma/client'
import IconButton from '../general/IconButton'
import Button from '../general/Button'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import DatePicker from '../general/DatePicker'
import AutoCompleteInput from '../general/AutoCompleteInput'
import { ExtendedInstitute } from '../../types/profile-card'

interface DeleteUniversityMissionButtonProps {
  universityMissionId: string
  universityMissionDescription: string
}

const DeleteUniversityMissionButton: React.FC<DeleteUniversityMissionButtonProps> = (props) => {
  const universityMissionId = props.universityMissionId
  const universityMissionDescription = props.universityMissionDescription

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<Partial<Unit>>();
  const toast = useToast()
  const router = useRouter()
  const key = useUUID()

  const onSubmit: SubmitHandler<Partial<Unit>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/university_missions`, {
      method: 'DELETE',
      body: JSON.stringify({ id: universityMissionId })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully deleted University Mission!',
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

  return (
    <>
      <Button 
        leftIcon={<DeleteIcon />}
        color="white"
        bgColor="brand.red"
        borderRadius={10}
        _hover={{
          color: 'brand.red',
          bgColor: 'brand.cardBackground'
        }}
        onClick={onOpen}
      >Delete</Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Delete {universityMissionDescription}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You are about to delete {universityMissionDescription} along with its research thrust(s). Do you want to proceed?</Text>
          </ModalBody>

          <ModalFooter>
            <Button 
              isLoading={submitting} 
              color="white"
              bgColor="brand.red"
              borderRadius={10}
              _hover={{
                color: 'brand.red',
                bgColor: 'brand.cardBackground'
              }}
              mr={3} 
              type="submit"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteUniversityMissionButton