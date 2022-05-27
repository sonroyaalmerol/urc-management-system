import React from 'react'

import { useDisclosure, Text, Input, VStack } from '@chakra-ui/react'
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

interface EditProjectTitleButtonProps {

}

const EditProjectTitleButton: React.FC<EditProjectTitleButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit } = useForm<Partial<Project>>();

  const onSubmit: SubmitHandler<Partial<Project>> = data => {
    console.log(data)
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
                defaultValue=""
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