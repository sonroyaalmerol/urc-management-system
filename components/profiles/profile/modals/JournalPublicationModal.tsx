import React from 'react'

import type { ExtendedJournalPublication, ExtendedProfile } from '../../../../types/profile-card'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Wrap,
  WrapItem,
  useToast,
} from '@chakra-ui/react'
import Button from '../../../general/Button'
import format from 'date-fns/format'
import FileDetails from '../../../general/FileDetails'
import { CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import ButtonWithConfirmation from '../../../general/ButtonWithConfirmation'
import { useRouter } from 'next/router'
import useUUID from '../../../../utils/client/useUUID'
import { roleChecker } from '../../../../utils/roleChecker'
import { useSession } from 'next-auth/react'
import { MODIFY_RESEARCHER_PROFILE } from '../../../../utils/permissions'

const JournalPublicationModal: React.FC<{
  entry: ExtendedJournalPublication,
  profile: Partial<ExtendedProfile>,
  isOpen: boolean,
  onClose: () => void
}> = (props) => {

  const [deleting, setDeleting] = React.useState(false)
  const { entry, isOpen, onClose, profile } = props

  const router = useRouter()
  const key = useUUID()
  const toast = useToast()
  const session = useSession()

  return (
    <Modal key={`${entry.id}-modal`} isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{entry.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={4}>
          { roleChecker(session.data.profile, MODIFY_RESEARCHER_PROFILE) && (
            <Wrap>
              <WrapItem>
                <ButtonWithConfirmation 
                  aria-label='Remove'
                  color="white"
                  bgColor="brand.red"
                  _hover={{
                    color: 'brand.red',
                    bgColor: 'brand.cardBackground'
                  }}
                  confirmationMessage={`
                    You are about to remove ${entry.title} from the profile. Do you want to proceed?
                  `}
                  isLoading={deleting}
                  leftIcon={<CloseIcon />}
                  onClick={async () => {
                    setDeleting(true)

                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/journal_publications`, {
                        method: 'DELETE',
                        body: JSON.stringify({ id: entry.id })
                      }
                    ).then(res => res.json())
                    
                    if (res.success) {
                      onClose()
                      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
                      toast({
                        title: 'Success!',
                        description: `Successfully removed entry from profile!`,
                        status: 'success'
                      })
                    } else {
                      toast({
                        title: 'Error!',
                        description: res.error,
                        status: 'error'
                      })
                    }

                    setDeleting(false)
                  }}
                >
                  Remove from profile
                </ButtonWithConfirmation>
              </WrapItem>
              <WrapItem>
                <ButtonWithConfirmation 
                  aria-label='Delete'
                  color="white"
                  bgColor="brand.red"
                  _hover={{
                    color: 'brand.red',
                    bgColor: 'brand.cardBackground'
                  }}
                  confirmationMessage={`
                    You are about to delete ${entry.title} from ALL profiles. Do you want to proceed?
                  `}
                  isLoading={deleting}
                  leftIcon={<DeleteIcon />}
                  onClick={async () => {
                    setDeleting(true)

                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/journal_publications`, {
                        method: 'POST',
                        body: JSON.stringify({ id: entry.id })
                      }
                    ).then(res => res.json())
                    
                    if (res.success) {
                      onClose()
                      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
                      toast({
                        title: 'Success!',
                        description: `Successfully deleted entry from the database!`,
                        status: 'success'
                      })
                    } else {
                      toast({
                        title: 'Error!',
                        description: res.error,
                        status: 'error'
                      })
                    }

                    setDeleting(false)
                  }}
                >
                  Delete for all
                </ButtonWithConfirmation>
              </WrapItem>
            </Wrap>
            ) }
            <Wrap align="center">
              <WrapItem fontWeight="bold">Journal:</WrapItem>
              <WrapItem>{entry.journal}</WrapItem>
            </Wrap>
            <Wrap align="center">
              <WrapItem fontWeight="bold">Date Published:</WrapItem>
              <WrapItem>{format(new Date(entry.date_published), 'MMM dd, yyyy')}</WrapItem>
            </Wrap>
            <Wrap align="center">
              <WrapItem fontWeight="bold">ISSN:</WrapItem>
              <WrapItem>{entry.issn}</WrapItem>
            </Wrap>
            <Wrap align="center">
              <WrapItem fontWeight="bold">URL:</WrapItem>
              <WrapItem>{entry.url}</WrapItem>
            </Wrap>
            <Wrap align="center">
              { entry.file_uploads.map((file) => (
                <WrapItem key={file.id}>
                  <FileDetails isViewable file={file} />
                </WrapItem>
              )) }
            </Wrap>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Wrap>
            <WrapItem>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </WrapItem>
          </Wrap>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JournalPublicationModal
