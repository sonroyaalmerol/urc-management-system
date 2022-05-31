import React from 'react'

import ListTemplate from '../../general/templates/ListTemplate'

import type { ComponentProps, ExtendedResearchEvent } from '../../../types/profile-card'
import CardTemplate from '../../general/templates/CardTemplate'

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

const ResearchEvent: React.FC<ComponentProps> = (props) => {
  const profile = props.profile

  const [entries, setEntries] = React.useState<ExtendedResearchEvent[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/research_events?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
      title="Research Events"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
      profileId={profile.id}
      onNew={() => {
        router.push(`/verifications/research_event`)
      }}
    >
      { entries.map((entry) => (
        <>
          <CardTemplate 
            key={entry.id} 
            entry={entry} 
            onClick={onOpen}
          />
          <Modal key={`${entry.id}-modal`} isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{entry.event_name}</ModalHeader>
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

export default ResearchEvent
