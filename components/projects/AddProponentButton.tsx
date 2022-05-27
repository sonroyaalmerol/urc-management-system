import React from 'react'

import { useDisclosure, Text, Input, VStack, Icon } from '@chakra-ui/react'
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
import type { Project } from '@prisma/client'
import IconButton from '../general/IconButton'

interface AddProponentButtonProps {

}

const AddProponentButton: React.FC<AddProponentButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control, handleSubmit } = useForm<Partial<Project>>();

  const onSubmit: SubmitHandler<Partial<Project>> = data => {
    console.log(data)
    onClose()
  };

  return (
    <>
      <IconButton
        aria-label='Add Proponent'
        onClick={onOpen}
        icon={<Icon as={MdGroupAdd} w={6} h={6} />}
      />
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Proponent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" align="baseline" spacing={1}>
              <Text paddingLeft="1rem" fontSize="md" color="brand.blue" fontWeight="bold">Proponent</Text>
              <Controller
                name="title"
                control={control}
                defaultValue="Demo only, form layout not final"
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

export default AddProponentButton