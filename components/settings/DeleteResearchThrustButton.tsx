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

interface DeleteResearchThrustButtonProps {
  universityMissionId: string
  researchThrustId: string
  researchThrustDescription: string
}

const DeleteResearchThrustButton: React.FC<DeleteResearchThrustButtonProps> = (props) => {
  const universityMissionId = props.universityMissionId
  const researchThrustId = props.researchThrustId
  const researchThrustDescription = props.researchThrustDescription

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<Partial<Unit>>();
  const toast = useToast()
  const router = useRouter()
  const key = useUUID()

  const onSubmit: SubmitHandler<Partial<Unit>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/university_missions/${universityMissionId}/research_thrusts`, {
      method: 'DELETE',
      body: JSON.stringify({ id: researchThrustId })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully deleted unit!',
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
      <IconButton 
        aria-label='Remove'
        variant='red'
        onClick={onOpen}
        icon={<DeleteIcon />}
      />
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Delete {researchThrustDescription}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You are about to delete {researchThrustDescription}. Do you want to proceed?</Text>
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

export default DeleteResearchThrustButton