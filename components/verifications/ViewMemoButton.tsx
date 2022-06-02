import React from 'react'

import { useDisclosure } from '@chakra-ui/react'

import Button from '../general/Button'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button as StockButton
} from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'
import type { InstituteNews } from '@prisma/client'
import parseHTML from '../../utils/client/parseHTML'

interface ViewMemoButtonProps {
  instituteNews: InstituteNews
}

const ViewMemoButton: React.FC<ViewMemoButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <StockButton
        onClick={onOpen}
        size="xs"
      >
        View Full News
      </StockButton>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.instituteNews.title}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {parseHTML(props.instituteNews.content)}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} type="submit" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ViewMemoButton