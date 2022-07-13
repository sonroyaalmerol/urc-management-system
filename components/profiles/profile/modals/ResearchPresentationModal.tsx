import React from 'react'

import type { ExtendedProfile, ExtendedResearchPresentation } from '../../../../types/profile-card'

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

const ResearchPresentationModal: React.FC<{
  entry: ExtendedResearchPresentation,
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
                      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/research_presentations`, {
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
                      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/research_presentations`, {
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
              <WrapItem fontWeight="bold">Location:</WrapItem>
              <WrapItem>{entry.location}</WrapItem>
            </Wrap>
            <Wrap align="center">
              <WrapItem fontWeight="bold">Event Date:</WrapItem>
              <WrapItem>{format(new Date(entry.event_date), 'MMM dd, yyyy')}</WrapItem>
            </Wrap>
            <Wrap align="center">
              <WrapItem fontWeight="bold">Conference:</WrapItem>
              <WrapItem>{entry.conference}</WrapItem>
            </Wrap>
            <Wrap align="center">
              <WrapItem fontWeight="bold">Budget:</WrapItem>
              <WrapItem>{entry.budget}</WrapItem>
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

export default ResearchPresentationModal
