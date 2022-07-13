import React from 'react'

import type {
  ComponentProps,
  ExtendedBookPublication
} from '../../../types/profile-card'
import CardTemplate from '../../general/templates/CardTemplate'
import ListTemplate from '../../general/templates/ListTemplate'

import {
  useDisclosure,
} from '@chakra-ui/react'
import Button from '../../general/Button'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../../utils/roleChecker'
import { MODIFY_RESEARCHER_PROFILE } from '../../../utils/permissions'
import BookPublicationModal from './modals/BookPublicationModal'

const BookPublications: React.FC<ComponentProps> = (props) => {
  const profile = props.profile
  const session = useSession()

  const [entries, setEntries] = React.useState<ExtendedBookPublication[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/book_publications?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
      title="Book Publications"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
      profileId={profile.id}
      onNew={() => {
        router.push(`/verifications/book_publication?profile_id=${profile.id}`)
      }}
      disabled={profile.id !== session.data.profile.id && !roleChecker(session.data.profile, MODIFY_RESEARCHER_PROFILE)}
    >
      { entries.map((entry) => (
        <>
          <CardTemplate
            key={entry.id}
            entry={entry}
            role={entry.bridge_profiles.filter((bridge) => bridge.profile_id === profile.id)[0].role_title}
            onClick={onOpen}
          />
          <BookPublicationModal
            profile={profile}
            entry={entry}
            isOpen={isOpen}
            onClose={onClose}
          />
        </>
      )) }
    </ListTemplate>
  )
}

export default BookPublications
