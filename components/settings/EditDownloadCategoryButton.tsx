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
import type { DownloadCategory, Institute, ProfileToInstituteBridge, Unit } from '@prisma/client'
import IconButton from '../general/IconButton'
import Button from '../general/Button'
import { useRouter } from 'next/router'
import useUUID from '../../lib/client/useUUID'
import DatePicker from '../general/DatePicker'
import AutoCompleteInput from '../general/AutoCompleteInput'
import { ExtendedInstitute } from '../../types/profile-card'

interface EditDownloadCategoryButtonProps {
  category: DownloadCategory
}

const EditDownloadCategoryButton: React.FC<EditDownloadCategoryButtonProps> = (props) => {
  const category = props.category

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [submitting, setSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<Partial<DownloadCategory>>();
  const toast = useToast()
  const router = useRouter()
  const key = useUUID()

  const onSubmit: SubmitHandler<Partial<DownloadCategory>> = async data => {
    setSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/downloads/categories`, {
      method: 'POST',
      body: JSON.stringify({...data, id: category.id})
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully edited category!',
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
      <Button leftIcon={<EditIcon />} onClick={onOpen}>Edit Category</Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <VStack spacing={4}>
              <VStack w="full" align="baseline" spacing={1}>
                <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Name</Text>
                <Controller
                  name="title"
                  control={control}
                  defaultValue={category.title}
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

export default EditDownloadCategoryButton