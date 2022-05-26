import React from 'react'

import { useDisclosure, Text, Input, VStack } from '@chakra-ui/react'
import { useForm, Controller, SubmitHandler } from "react-hook-form"

import Button from '../Button'

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

interface NewProjectButtonProps {

}

const NewProjectButton: React.FC<NewProjectButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit } = useForm<Partial<Project>>();

  const onSubmit: SubmitHandler<Partial<Project>> = data => {
    console.log(data)
    onClose()
  };

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

export default NewProjectButton