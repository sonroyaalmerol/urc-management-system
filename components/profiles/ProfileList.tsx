import React from 'react'
import { Center, Spinner, chakra, VStack, SimpleGrid } from '@chakra-ui/react'

import type { Profile, User } from '@prisma/client'

import { useDebounce } from 'use-debounce'

import InfiniteScroll from 'react-infinite-scroller'
import ProfileCard from './ProfileCard'

interface ProfileListProps {
  search?: string
}

const ProfileList: React.FC<ProfileListProps> = (props) => {
  const [entries, setEntries] = React.useState<(Profile & {
    user: User;
  })[]>([])

  const [deferredSearch] = useDebounce(props.search, 500)
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const onLoadNewMemo = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/profiles?${props.search.length > 0 ? `&query=${props.search}` : ''}${entries.length > 0 && !args.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args.reset) {
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
  }, [props.search])

  React.useEffect(() => {
    onLoadNewMemo({ reset: true })
  }, [deferredSearch])
  return (
    <>
      { !loading ? (
        <InfiniteScroll
          pageStart={0}
          loadMore={onLoadNewMemo}
          hasMore={entries.length < count}
          loader={
            <Center marginTop="2rem" key="infinite-scroll-load">
              <Spinner color="brand.blue" />
            </Center>
          }
          element={chakra.div}
          w="full"
        >
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
            { entries.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            )) }
          </SimpleGrid>
        </InfiniteScroll>
      ) : (
        <Center marginTop="2rem">
          <Spinner color="brand.blue" />
        </Center>
      ) }
    </>
  )
}

export default ProfileList
