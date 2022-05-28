import React from 'react'

import type { ComponentProps, ExtendedExternalResearch } from '../../../types/profile-card'
import CardTemplate from './CardTemplate'
import ListTemplate from './ListTemplate'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import Button from '../../general/Button'
import { useRouter } from 'next/router'

const ExternalResearches: React.FC<ComponentProps> = (props) => {
  const profile = props.profile

  const [entries, setEntries] = React.useState<ExtendedExternalResearch[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/profiles/${profile.id}/external_researches?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args?.reset) {
      setEntries(newEntries?.data ?? [])
    } else {
      setEntries((currEntries) => {
        return [...currEntries, ...(newEntries?.data.filter((memo) => !currEntries.find((currEntry) => currEntry.id === memo.id)) ?? []) ]
      })
    }
    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    loadNewEntries()
  }, [])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const router = useRouter()

  return (
    <ListTemplate
      title="External Researches"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
      profileId={profile.id}
      onNew={() => {
        router.push(`/verifications/external_research`)
      }}
    >
      { entries.map((entry) => (
        <>
          <CardTemplate 
            key={entry.id} 
            entry={entry} 
            role={entry.bridge_profiles.filter((bridge) => bridge.profile_id === profile.id)[0].role_title} 
            onClick={onOpen}
          />
          <Modal key={`${entry.id}-modal`} isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{entry.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )) }
    </ListTemplate>
  )
}

export default ExternalResearches
