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

import { EditIcon } from '@chakra-ui/icons'
import type { Project } from '@prisma/client'
import IconButton from '../general/IconButton'
import { useRouter } from 'next/router'

interface EditProjectTitleButtonProps {
  projectId: string,
  currentTitle: string
}

const EditProjectTitleButton: React.FC<EditProjectTitleButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit, reset } = useForm<Partial<Project>>();
  const router = useRouter()
  const toast = useToast()

  const onSubmit: SubmitHandler<Partial<Project>> = async data => {
    const res = await fetch(`/api/management/projects`, {
      method: 'POST',
      body: JSON.stringify({...data, mode: 'update', id: props.projectId})
    }).then((i) => i.json())

    if (res.success) {
      router.push(`/projects/${res.data.slug}`)
      toast({
        title: 'Success!',
        description: 'Successfully updated project title!',
        status: 'success'
      })
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }
    
    onClose()
  };

  return (
    <>
      <IconButton
        aria-label='Edit Project'
        onClick={onOpen}
        icon={<EditIcon />}
      />
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" align="baseline" spacing={1}>
              <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Project Title</Text>
              <Controller
                name="title"
                control={control}
                defaultValue={props.currentTitle}
                render={({ field }) => <Input {...field} />}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} type="submit">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProjectTitleButton