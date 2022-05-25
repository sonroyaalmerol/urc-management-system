import React from 'react'

import { useDisclosure, Text } from '@chakra-ui/react'

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

interface NewProjectButtonProps {

}

const NewProjectButton: React.FC<NewProjectButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight='bold' mb='1rem'>
              You can scroll the content behind the modal
            </Text>
            <Text>
              Test
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NewProjectButton