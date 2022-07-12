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

import { AddIcon, EditIcon } from '@chakra-ui/icons'
import type { Institute, ProfileToInstituteBridge, Unit, UniversityMission } from '@prisma/client'
import IconButton from '../general/IconButton'
import Button from '../general/Button'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import DatePicker from '../general/DatePicker'
import AutoCompleteInput from '../general/AutoCompleteInput'
import { ExtendedInstitute } from '../../types/profile-card'

interface EditUniversityMissionButtonProps {
  universityMissionId: string
  universityMissionDescription: string
}

const EditUniversityMissionButton: React.FC<EditUniversityMissionButtonProps> = (props) => {
  const universityMissionId = props.universityMissionId
  const universityMissionDescription = props.universityMissionDescription

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<Partial<UniversityMission>>();
  const toast = useToast()
  const router = useRouter()
  const key = useUUID()

  const onSubmit: SubmitHandler<Partial<Unit>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/university_missions`, {
      method: 'POST',
      body: JSON.stringify({...data, id: universityMissionId})
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully edited University Mission!',
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
      <Button leftIcon={<EditIcon />} onClick={onOpen}>Edit University Mission</Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit University Mission</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Description</Text>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={universityMissionDescription}
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

export default EditUniversityMissionButton