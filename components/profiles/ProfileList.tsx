import React from 'react'
import { Center, Spinner, chakra, VStack, SimpleGrid } from '@chakra-ui/react'

import type { Profile, User } from '@prisma/client'

import { useDebounce } from 'use-debounce'

import ProfileCard from './ProfileCard'
import CustomInfiniteScroll from '../general/CustomInfiniteScroll'

interface ProfileListProps {
  search?: string,
  refreshKey?: number
  unitFilter?: string
}

const ProfileList: React.FC<ProfileListProps> = (props) => {
  const [entries, setEntries] = React.useState<(Profile & {
    user: User;
  })[]>([])

  const [deferredSearch] = useDebounce(props.search, 500)
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles?${props.unitFilter ? `&unit=${props.unitFilter}` : ''}${props.search.length > 0 ? `&query=${props.search}` : ''}${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
    if (deferredSearch === props.search) {
      setLoading(false)
    }
  }, [props.search])

  React.useEffect(() => {
    setLoading(true)
    loadNewEntries({ reset: true })
  }, [deferredSearch, props.refreshKey, props.unitFilter])

  React.useEffect(() => {
    setLoading(true)
  }, [props.refreshKey])
  return (
    <>
      { !loading ? (
        <CustomInfiniteScroll
          pageStart={0}
          loadMore={loadNewEntries}
          hasMore={entries.length < count}
          element={SimpleGrid}
          columns={{ base: 1, lg: 2, xl: 3 }}
          spacing={4}
        >
          { entries.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          )) }
        </CustomInfiniteScroll>
      ) : (
        <Center marginTop="2rem" w="full" h="full">
          <Spinner color="brand.blue" />
        </Center>
      ) }
    </>
  )
}

export default ProfileList
