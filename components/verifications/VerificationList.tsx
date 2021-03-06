import React from 'react'
import { Center, Spinner, chakra, VStack, SimpleGrid } from '@chakra-ui/react'

import type { ExtendedVerificationRequest } from '../../types/profile-card'
import VerificationCard from './VerificationCard'
import CustomInfiniteScroll from '../general/CustomInfiniteScroll'

interface VerificationListProps {
  search?: string,
  types?: string[],
  status?: string[]
}

const VerificationList: React.FC<VerificationListProps> = (props) => {
  const [entries, setEntries] = React.useState<ExtendedVerificationRequest[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    setLoading(true)
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/verifications?${props.types?.length > 0 ? `&types=${props.types.join(',')}` : ''}${props.status?.length > 0 ? `&status=${props.status}` : ''}${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
    loadNewEntries({ reset: true })
  }, [props.types, props.status])

  const afterAction = (entryId: string) => {
    setEntries((prev) => prev.filter((i) => i.id !== entryId))
  }

  return (
    <>
      { !loading ? (
        <CustomInfiniteScroll
          pageStart={0}
          loadMore={loadNewEntries}
          hasMore={entries.length < count}
          element={SimpleGrid}
          w="full"
          columns={{ base: 1, lg: 2 }}
          spacing={4}
        >
          { entries.map((entry) => (
            <VerificationCard
              key={entry.id}
              request={entry}
              afterAction={afterAction}
            />
          )) }
        </CustomInfiniteScroll>
      ) : (
        <Center marginTop="2rem">
          <Spinner color="brand.blue" />
        </Center>
      ) }
    </>
  )
}

export default VerificationList
