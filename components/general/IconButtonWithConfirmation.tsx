import React from 'react'
import { IconButtonProps, Text, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import IconButton from './IconButton'
import parseHTML from '../../lib/client/parseHTML'
import Button from './Button'

interface IconButtonWithConfirmationProps extends IconButtonProps {
  confirmationMessage?: string
}

const IconButtonWithConfirmation: React.ForwardRefRenderFunction<HTMLButtonElement, IconButtonWithConfirmationProps> = (props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const divProps = Object.assign({}, props)
  delete divProps.onClick
  delete divProps.confirmationMessage

  return (
    <>
      <IconButton onClick={onOpen} {...divProps} />
      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{parseHTML(props.confirmationMessage)}</Text>
          </ModalBody>

          <ModalFooter>
            <Wrap spacing={2}>
              <WrapItem>
                <Button
                  bgColor="white"
                  color="brand.red"
                  _hover={{
                    bgColor: 'brand.cardBackground',
                    color:'brand.red'
                  }}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </WrapItem>
              <WrapItem>
                <Button onClick={(e) => {
                  onClose()
                  if (props.onClick) {
                    props.onClick(e)
                  }
                }}>
                  Proceed
                </Button>
              </WrapItem>
            </Wrap>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default React.forwardRef(IconButtonWithConfirmation)